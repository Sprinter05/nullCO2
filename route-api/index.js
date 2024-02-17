// Express package
const express = require('express')

// Set up HTTPS server app
var app = express()
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(require('./routes/router')); // User defined routes manager

// Start app on specified port and log to console
app.listen(app.get('port'),()=>{
    console.log(`[!] SERVER listening on port ${app.get('port')}`);
});