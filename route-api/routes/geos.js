const nodeGeocoder = require('node-geocoder')
const geocoder = nodeGeocoder({provider: 'openstreetmap'})

exports.getPlaceInfo = async function(origin){
    const result = await geocoder.geocode(origin)
    const jsonOutput = {
        "lat": `${result[0].latitude}`,
        "lon": `${result[0].longitude}`,
        "loc": `${result[0].formattedAddress}`
    }
    return jsonOutput
}