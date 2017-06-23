const _ = require('lodash'),
    Promise = require('bluebird'),
    express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    timeslot = require('./controller/timeslot'),
    bootstrap = require('./utils/bootstrap')

const entry = require('./routes/entry')

bootstrap.run()

app.use('/entry', entry)

app.get('/timeslot', (req, res, next) => {
    return timeslot.getAll()
    .then((timeslots) => {
        res.json(_.map(timeslots, (timeslot) => {return timeslot.toJSON()}))
    })
})

app.listen(port);

console.log('soccer RESTful API server started on: ' + port)
