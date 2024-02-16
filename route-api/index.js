const express = require('express')

var app = express()
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(require('./routes/router'));

app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});