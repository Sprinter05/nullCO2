const { Router } = require('express');
const router = Router();
const { getPlaceInfo } = require('./geos')

router.get('/', function(req, res) {    
    res.json(
        {
            "travel-minimiser": "RESTful API"
        }
    );
})

router.get('/get_place', async function(req, res) {
    if(req.query.name === undefined || req.query.name.length === 0) return res.status(401).send("Error 401")
    const placeInfo = await getPlaceInfo(req.query.name)
    res.json(placeInfo)
    return
})

router.get('/calc_distance', async function(req, res) {})
 
module.exports = router;