# Welcome to the nullCO2 API!
---
This API's purpose is to give the **Web frontend** an easier time retrieving values with simple HTTPS requests without having to worry about what other APIs the requests are coming from or how to handle really big JSON objects that contain properties that are useless most of the time for our application.
## What libraries do we work with?
- [`express.js`](https://github.com/expressjs/express) to host the server and provide basic functionalities like routing or JSON object inspection, which is pretty useful if you want to use the API directly from a browser!
- [`node-geocoder`](https://github.com/nchaulet/node-geocoder) allows us to query any search about a location and get its coordinates.
- [`geo-lib`](https://github.com/manuelbieh/geolib) is the tool we use to calculate distances between two points in the real world, it's only 2D but we didn't feel like finding a library that supported 3D calculations would really prove worthy for this project.
- [`amadeus-node`](https://github.com/amadeus4dev/amadeus-node), yet another really useful tool that helped us retrieve values for nearby airports, upcoming flights, flight CO2 emissions.
