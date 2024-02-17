const nodeGeocoder = require('node-geocoder')
const geolib = require('geolib')
const amadeusAPI = require('amadeus');
const { quickSort } = require('./utils')

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
    return jsonOutput
}

exports.getDistance = async function(og, dt){
    const distMeters = geolib.getDistance(
        { latitude: og.lat, longitude: og.len },
        { latitude: dt.lat, longitude: dt.len }
    )
    return distMeters
}

exports.getMiddle = function(points){
    const midPoint = geolib.getCenter(points)
    return midPoint
}

exports.getAirport = async function(lat, len){
    try {
        const airport = await amadeus.referenceData.locations.airports.get({longitude: len, latitude: lat})
        const maxDatum = Object.keys(airport.data).length
        const top = 3
        var indexDist = {}
        var sortArray = []

        for(let i=0; i<=maxDatum-1; i++){
            indexDist[`${i}`] = airport.data[`${i}`].distance.value
        }
        for(var i=0; i<=9; i++){
            sortArray.push(indexDist[`${i}`])
        }

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
        }
        
        return outputJson;
    } catch (e) {
        console.log(e)
    }
}