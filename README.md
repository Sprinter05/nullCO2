# nullCO2
---
The idea for this project started at [HackUDC 2024](https://hackudc.gpul.org/) when they gave us the challenge of coding a program that would generate a trip from point "*x*" to point "*y*" generating the less pollution possible with a focus on group trips, such as business trips. Hence the name, **nullCO2**.
## The Implementation
### Backend
Developed by [Sprinter05](https://github.com/Sprinter05) in [`node.js`](https://nodejs.org/en), with packages like `express.js` and `amadeus`. It provides a set of **HTTPs** `GET` requests that are used by the frontend to retrieve data from the different **APIs** that conform this project in a __simple and easily accessible way__. More information can be read in the [API Readme](./route-api/README.md).
### Frontend
Developed by [yagueto](https://github.com/yagueto) in [`flask`](https://flask.palletsprojects.com/en/3.0.x/). Provides a visualization for the backend, using HTML/CSS as well as [`matplotlib`](https://matplotlib.org/) for plotting graphs.
### Path finder algorithm
Developed by [dza205](https://github.com/dza205) also in [`node.js`] after switching between different **Functional Programming** languages that simply did not work out. It uses the [`json-graph-algorithms`](https://github.com/chen0040/js-graph-algorithms) package to create a *Graph* that connects all passangers with the airport and with one another and then find the minimal path using [Kruskal's algorithm](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm) to get everyone to the airport using the __least amounts of cars__ and taking the __shortest possible path__.
## The Process
The development of this project was definetly not an easy one. The APIs used in the backend are not the most well documented and easy to work with, probably due to their testing nature, but even with that they did have some sketchy endpoints. The performance of the queries is not the fastest thing in the world due to that (and not due to the implementation itself).
## Credits
Sprinter05, yagueto and dza205