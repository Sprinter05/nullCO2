const { Router } = require('express');
const router = Router();
const { getPlaceInfo, getDistance, getMiddle, getAirport } = require('./geos')

router.get('/', function(req, res) {    
    res.json(
        {
            "travel-minimiser": "RESTful API"
        }
    );
})

router.get('/get_place', async function(req, res) {
    const rQ = req.query
    if(rQ.name === undefined || rQ.name.length === 0) {
        return res.status(401).send("Error 401")
    }
    const placeInfo = await getPlaceInfo(rQ.name)
    res.json(placeInfo)
    return
})

router.get('/calc_distance', async function(req, res) {
    const rQ = req.query
    const parseRequest = [
        { "lat": rQ.ogLat.replace(/['"]+/g, ''), "len": rQ.ogLen.replace(/['"]+/g, '') },
        { "lat": rQ.dtLat.replace(/['"]+/g, ''), "len": rQ.dtLen.replace(/['"]+/g, '') }
    ]
    const distance = await getDistance(parseRequest[0], parseRequest[1])
    res.json({"distance": distance})
})

router.get('/get_airport/:passengers', async function(req, res) {
    const rQ = req.query
    const maxPeople = req.params.passengers
    var boundingBox = []
    for (var i=0; i<=maxPeople-1; i++){
        boundingBox[i] = {}
        boundingBox[i].latitude = rQ[`lat${i+1}`]
        boundingBox[i].longitude = rQ[`len${i+1}`]
    }
    midpoint = await getMiddle(boundingBox)
    airport = await getAirport(midpoint.latitude, midpoint.longitude)
    res.json(airport)
})

module.exports = router;