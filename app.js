const _ = require('lodash'),
    Promise = require('bluebird'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 3000,
    bootstrap = require('./utils/bootstrap')

// Routes
const entry = require('./routes/entry'),
    timeslot = require('./routes/timeslot')

bootstrap.run()

// Parse body
app.use(bodyParser.json())

app.use('/entry', entry)
app.use('/timeslot', timeslot)

app.listen(port);

console.log('soccer RESTful API server started on: ' + port)
