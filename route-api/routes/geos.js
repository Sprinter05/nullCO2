const nodeGeocoder = require('node-geocoder')
const geolib = require('geolib')
const amadeusAPI = require('amadeus');
const { quickSort, ArraytoJSON, JSONtoArray } = require('./utils');

var geocoder = nodeGeocoder({provider: 'openstreetmap'})
var amadeus = new amadeusAPI({
    clientId: 'z6H8c2TRtoAyWwF3Gj4UGnMNvASiSNi1',
    clientSecret: 'plUBkBSZkt0Bgnf9'
});

exports.getPlaceInfo = async function(origin){
    const result = await geocoder.geocode(origin)
    const jsonOutput = {
        "lat": `${result[0].latitude}`,
        "lon": `${result[0].longitude}`,
        "loc": `${result[0].formattedAddress}`
    }
    console.log(`[+] NEW getPlaceInfo for ${origin}`)
    if(jsonOutput === undefined || jsonOutput === null){
        console.log(`[-] UNDEFINED on getPlaceInfo`)
    }
    return jsonOutput
}

exports.getDistance = async function(og, dt){
    const distMeters = geolib.getDistance(
        { latitude: og.lat, longitude: og.len },
        { latitude: dt.lat, longitude: dt.len }
    )
    console.log(`[+] NEW getDistance for ${og}, ${dt}`)
    if(distMeters === undefined || distMeters === null){
        console.log(`[-] UNDEFINED on getDistance`)
    }
    return distMeters
}

exports.getMiddle = function(points){
    const midPoint = geolib.getCenter(points)
    console.log(`[+] NEW getMiddle for n=${points.length} size`)
    if(midPoint === undefined || midPoint === null){
        console.log(`[-] UNDEFINED on getMiddle`)
    }
    return midPoint
}

exports.getAirport = async function(lat, len){
    var airport
    try {
        airport = await amadeus.referenceData.locations.airports.get({longitude: len, latitude: lat})
    } catch (e) { console.log(e) }

    const maxDatum = Object.keys(airport.data).length
    const top = 3
    var indexDist = {}
        
    for(let i=0; i<=maxDatum-1; i++){
        indexDist[`${i}`] = airport.data[`${i}`].distance.value
    }
        
    var sortArray = JSONtoArray(indexDist)
    const minDists = quickSort(sortArray, 0, sortArray.length-1)
    var topIndex = []     
    for(let i=0; i<=top-1; i++){
        for (let j=0; j<=maxDatum-1; j++){
            if (indexDist[`${j}`] === minDists[i]){
                topIndex.push(j)
            }
        }
    }

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
        
    console.log(`[+] NEW getAirport for ${lat}, ${len}`)
    if(outputJson === undefined || outputJson === null){
        console.log(`[-] UNDEFINED on getAirport`)
    }
    return outputJson;
}

async function getPrices(jsonInput){
    let retQ
    try {
        retQ = await amadeus.shopping.flightOffers.pricing.post(JSON.stringify(jsonInput))
        return retQ 
    } catch(e){
        console.log(e)
        return null
    }
}

exports.getFlight = async function(ogIata, dtIata, date){
    var flight
    try {
        flight = await amadeus.shopping.flightOffersSearch.get({
            "originLocationCode": ogIata,
            "destinationLocationCode": dtIata,
            "departureDate": date,
            "adults": '1'
        })
    } catch (e) {console.log(e)}
    const top = 5
    var fullJSON = {}

    for(let i=0; i <= top; i++){
        var jsonInput = {
            'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': [flight.data[`${i}`]]
            }
        }
        var query = await getPrices(jsonInput)
        if (query === null) break
        const qC = query.data.flightOffers[`0`]
        const mC = Object.keys(qC.itineraries['0'].segments).length
        var emissions = 0
        for(let j=0; j<=mC-1; j++){
            emissions += qC.itineraries['0'].segments[`${j}`].co2Emissions['0'].weight
        }
        fullJSON[`${i}`] = {
            "origin": qC.itineraries['0'].segments['0'].departure,
            "destination": qC.itineraries['0'].segments[`${mC-1}`].arrival,
            "carrierCode": qC.itineraries['0'].segments['0'].carrierCode,
            "price": qC.price,
            "emissions": emissions
        }
    } 
    console.log(`[+] NEW getFlight from ${ogIata}} to ${dtIata} on ${date}`)
    if(fullJSON === undefined || fullJSON === null){
        console.log(`[-] UNDEFINED on getFlight`)
    }
    return fullJSON
    
}