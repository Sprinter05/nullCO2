const nodeGeocoder = require('node-geocoder')
const geocoder = nodeGeocoder({provider: 'openstreetmap'})
const geolib = require('geolib')

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