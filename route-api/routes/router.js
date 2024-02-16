const { Router } = require('express');
const router = Router();
const { getPlaceInfo, getDistance } = require('./geos')

router.get('/', function(req, res) {    
    res.json(
        {
            "travel-minimiser": "RESTful API"
        }
    );
})

router.get('/get_place', async function(req, res) {
    rQ = req.query
    if(rQ.name === undefined || rQ.name.length === 0) {
        return res.status(401).send("Error 401")
    }
    const placeInfo = await getPlaceInfo(rQ.name)
    res.json(placeInfo)
    return
})

router.get('/calc_distance', async function(req, res) {
    rQ = req.query
    const parseRequest = [
        { "lat": rQ.ogLat.replace(/['"]+/g, ''), "len": rQ.ogLen.replace(/['"]+/g, '') },
        { "lat": rQ.dtLat.replace(/['"]+/g, ''), "len": rQ.dtLen.replace(/['"]+/g, '') }
    ]
    const distance = await getDistance(parseRequest[0], parseRequest[1])
    res.json({"distance": distance})
})
 
module.exports = router;