// Imports for node_modules
const nodeGeocoder = require('node-geocoder')
const geolib = require('geolib')
const amadeusAPI = require('amadeus');
const { quickSort, ArraytoJSON, JSONtoArray } = require('./utils'); // Methods from utils.js
const { amadeus_config } = require('../config.json')
const errJSON = { // Error message for requests
    "error": "Request could not be fulfilled!",
    "pleaseCheck": "That your fields and parameters are correct!",
    "nullCO2": "api_error"
}

// Geocoder API login from config.json
var geocoder = nodeGeocoder({provider: 'openstreetmap'})
var amadeus = new amadeusAPI({
    clientId: amadeus_config.id,
    clientSecret: amadeus_config.secret
});

// Returns longitude, latitude and full name of a specified query
// `query` -> Query for the search
exports.getPlaceInfo = async function(query){
    var result
    try {
        result = await geocoder.geocode(query)
    } catch(e) {console.log('[-] ERROR on getPlaceInfo' + '\n' + e)}
    // Return API error instead of node.js error
    if (result === undefined || result.length === 0) {
        console.log('[-] JSON ERROR on getPlaceInfo')
        return errJSON
    }
    const jsonOutput = {
        "lat": `${result[0].latitude}`,
        "len": `${result[0].longitude}`,
        "loc": `${result[0].formattedAddress}`
    }
    // Event logging
    console.log(`[+] NEW getPlaceInfo with query ${query}`)
    return jsonOutput
}

// Returns distance (in kilometers) between two points specified by (lat, len)
// `og` -> Original Point; `dt` -> Destination point 
exports.getDistance = async function(og, dt){
    const distMeters = geolib.getDistance(
        { latitude: og.lat, longitude: og.len }, // Point 1
        { latitude: dt.lat, longitude: dt.len } // Point 2
    )
    // Event logging
    console.log(`[+] NEW getDistance for ${og}, ${dt}`)
    return distMeters
}

// Calculates the middle point of an area defined by "n" points
// `points` -> Array of Objects specified by (latx. lenx) being "x" a number
exports.getMiddle = function(points){
    const midPoint = geolib.getCenter(points)
    // Event logging
    console.log(`[+] NEW getMiddle for n=${points.length} size`)
    return midPoint
}

// Returns top "n" of the neares airport(s) by the specified point
// `(lat, len)`-> Coordinates of the point on where to draw the find radius
exports.getAirport = async function(lat, len){
    var airport
    try {
        airport = await amadeus.referenceData.locations.airports.get({longitude: len, latitude: lat})
    } catch (e) { {console.log('[-] ERROR on getAirport' + '\n' + e)} }
    // Return API error instead of node.js error
    if (airport === undefined || airport.data.length === 0){
        console.log('[-] JSON ERROR on getAirport')
        return errJSON
    }
    
    // Airport defining variables
    const maxDatum = Object.keys(airport.data).length
    const top = 3
    var indexDist = {} // List of all distances to the middle point
        
    // Add all distances from airport(s) to middle point
    for(let i=0; i<=maxDatum-1; i++){
        indexDist[`${i}`] = airport.data[`${i}`].distance.value
    }
        
    // Sort the array using the quicksort algorithm
    var sortArray = JSONtoArray(indexDist) // Transforms the JSON into an array (normal methods dont work)
    const minDists = quickSort(sortArray, 0, sortArray.length-1)
    var topIndex = [] // List of top "n" indexes based on minimum distance to the middle point
    for(let i=0; i<=top-1; i++){
        for (let j=0; j<=maxDatum-1; j++){
            if (indexDist[`${j}`] === minDists[i]){
                topIndex.push(j)
            }
        }
    }

    // Format the output JSON and add values
    outputJson = {}
    for(let i=0; i<=top-1; i++){
        outputJson[`${i}`] = {}
        outputJson[`${i}`].locationName = airport.data[`${topIndex[i]}`].name
        outputJson[`${i}`].city = airport.data[`${topIndex[i]}`].address.cityName
        outputJson[`${i}`].country = airport.data[`${topIndex[i]}`].address.countryName
        outputJson[`${i}`].coords = airport.data[`${topIndex[i]}`].geoCode
        outputJson[`${i}`].distance = airport.data[`${topIndex[i]}`].distance.value
        outputJson[`${i}`].iata = airport.data[`${topIndex[i]}`].iataCode
    }
        
    // Event logging
    console.log(`[+] NEW getAirport for ${lat}, ${len}`)
    return outputJson;
}

// Used only to return emissions for each flight in another object
// `jsonInput` -> data: type + flightOffers[] (But it has only one element inside)
async function getPrices(jsonInput){
    var retQ
    try {
        retQ = await amadeus.shopping.flightOffers.pricing.post(JSON.stringify(jsonInput))
        return retQ 
    } catch(e){
        {console.log('[-] ERROR on getPrices' + '\n' + e)}
        return null
    }
}

// Transforms the given airline code into the airline name
// `cCode` -> Code for the airline
async function getAirline(cCode){
    const airlineName = await amadeus.referenceData.airlines.get({
        airlineCodes: cCode
    })
    return airlineName.data[`0`].businessName
}

// Gets top "n" flights between two given airports
// `ogIata` -> IATA code for Origin; `dtIata` -> IATA code for Destination
// `date` -> Date specified in YYYY-MM-DD format
exports.getFlight = async function(ogIata, dtIata, date){
    var flight
    try {
        // Queries the original information without emissions
        flight = await amadeus.shopping.flightOffersSearch.get({
            "originLocationCode": ogIata,
            "destinationLocationCode": dtIata,
            "departureDate": date,
            "adults": '1'
        })
    } catch (e) {{console.log('[-] ERROR on getFlight' + '\n' + e)}}
    // Return API error instead of node.js error
    if(flight === undefined || flight.data.length === 0) {
        console.log('[-] JSON ERROR on getFlight')
        return errJSON
    }
    
    const top = 5
    var fullJSON = {} // Good formatted JSON

    // Repeat for up to 5 entries that will be kept in the top
    // NOT SORTED in this case
    for(let i=0; i <= top; i++){
        // Sends POST request to pricing just to get emission information
        var jsonInput = {
            'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': [flight.data[`${i}`]]
            }
        }
        var query = await getPrices(jsonInput)
        
        // Stops after a 500 seemingly random error that blocks all next wqueries
        if (query === null) break
        
        // Abbreviations to avoid long as hell names
        const qC = query.data.flightOffers[`0`]
        const mC = Object.keys(qC.itineraries['0'].segments).length

        // Sum emissions of all segments
        var emissions = 0
        for(let j=0; j<=mC-1; j++){
            emissions += qC.itineraries['0'].segments[`${j}`].co2Emissions['0'].weight
        }

        // Get airline name information by code and dates
        airlineN = qC.itineraries['0'].segments['0'].carrierCode
        resolveAirlineN = await getAirline(airlineN)
        originDate = qC.itineraries['0'].segments['0'].departure
        departureDate = qC.itineraries['0'].segments[`${mC-1}`].arrival
        // Replace time-date strings
        originDate.at = originDate.at.replace("T", " ").replace(":00", "")
        departureDate.at = departureDate.at.replace("T", " ").replace(":00", "")

        // Format final JSON
        fullJSON[`${i}`] = {
            "origin": originDate,
            "destination": departureDate,
            "carrierCode": resolveAirlineN,
            "price": qC.price,
            "emissions": emissions
        }
    }
    // Event logging
    console.log(`[+] NEW getFlight from ${ogIata} to ${dtIata} on ${date}`)
    return fullJSON
}