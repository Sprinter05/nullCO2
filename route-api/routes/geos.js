const nodeGeocoder = require('node-geocoder')
const geolib = require('geolib')
const amadeusAPI = require('amadeus');

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

exports.getMiddle = async function(points){
    const midPoint = await geolib.getCenter(points)
    return midPoint
}

exports.getAirport = async function(lat, len){
    try {
        const airport = await amadeus.referenceData.locations.airports.get({latitude: lat, longitude: len})
        return airport;
    } catch (e) {
        console.log(e)
    }
}