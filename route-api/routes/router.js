// Create new Router for HTTPS requests
const { Router } = require('express');
const marked = require('marked')
const fs = require('fs')
const { cwd } = require('node:process')
const router = Router();
const { getPlaceInfo, getDistance, getMiddle, getAirport, getFlight } = require('./geos') // Methods from geos.js
const { kruskalFunc } = require('../../kruskal-algorithm/kruskal.js')
const docs = `/README.md`

// Error 401
const err401 = "Error 401 - Bad fields buddy!" // Currently disabled

// API Root -> Markdown Documentation
router.get('/', function(req, res) {    
    var path = cwd() + docs
    var file = fs.readFileSync(path, 'utf-8')
    res.send(marked.marked(file.toString()))
})

// Returns name of queried search
// get_place?name="<query>"
router.get('/get_place', async function(req, res) {
    const rQ = req.query
    //if (rQ.length === undefined){return res.status(401).send(err401)} // Throw 401

    // Call methods
    const placeInfo = await getPlaceInfo(rQ.name)
    res.json(placeInfo)
    return
})

// Returns distance in kilometers between two points
// calc_distance?ogLat=<latitude>&ogLen=<longitude>&dtLat=<latitude>&dtLen=<longitude>
router.get('/calc_distance', async function(req, res) {
    const rQ = req.query
    //if (rQ.length === undefined){return res.status(401).send(err401)}

    // Separate the two points in an array
    const parseRequest = [
        { "lat": rQ.ogLat.replace(/['"]+/g, ''), "len": rQ.ogLen.replace(/['"]+/g, '') },
        { "lat": rQ.dtLat.replace(/['"]+/g, ''), "len": rQ.dtLen.replace(/['"]+/g, '') }
    ]

    // Call methods
    const distance = await getDistance(parseRequest[0], parseRequest[1])
    res.json({"distance": distance})
})

// Returns the closes airport to the position of "n" amount of passengers
// get_airport/<"n" of passengers>?latx=<latitude>&lenx=<longitude> being "x" a number
router.get('/get_airport/:passengers', async function(req, res) {
    const rQ = req.query
    //if (rQ.length === undefined){return res.status(401).send(err401)} // Throw 401
    const maxPeople = req.params.passengers

    // Define area for search for airports
    var boundingBox = []
    for (let i=0; i<=maxPeople-1; i++){
        boundingBox[i] = {}
        boundingBox[i].latitude = rQ[`lat${i+1}`]
        boundingBox[i].longitude = rQ[`len${i+1}`]
    }

    // Get middle point of area and find airport in a circle drawn from that point
    midpoint = getMiddle(boundingBox)
    airport = await getAirport(midpoint.latitude, midpoint.longitude)
    res.json(airport)
})

// Returns the flight between two airports in a given date
// get_flight?ogIata=<IATA Code>&dtIata=<IATA Code>&date=<YYYY-MM-DD>
router.get('/get_flight', async function(req, res) {
    const rQ = req.query
    //if (rQ.length === undefined){return res.status(401).send(err401)} // Throw 401

    // Call methods
    const flights = await getFlight(rQ.ogIata, rQ.dtIata, rQ.date)
    res.json(flights)
})

router.get('/kruskal_algorithm', function(req, res) {
    const rQ = req.query
    //if (rQ.length === undefined){return res.status(401).send(err401)} //Throw 401
    var matrix = rQ.matrix.replace(/'/g,"\"")
    var sendMat = JSON.parse(matrix)
    const resultJson = kruskalFunc(sendMat)
    res.json(resultJson)
})

// Export all modules
module.exports = router;