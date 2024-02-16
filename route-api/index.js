const geocoderPkg = require('node-geocoder')

const geocoder = NodeGeocoder({
    provider: 'openstreetmap'
});

const query = 'Palacio de la Moncloa'

async function getCoords(query){
    const result = await geocoder.geocode
}