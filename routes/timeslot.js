const _ = require('lodash'),
    Promise = require('bluebird'),
    express = require('express'),
    router = express.Router(),
    t = require('../controller/timeslot')

router.route('/days')
    .get((req, res, next) => {
        return t.getDays(req.query.tz)
        .then((results) => {
            res.json(results)
        })
    })

router.route('/:id')
    .get((req, res, next) => {
        return t.getById(req.params.id)
        .then((timeslot) => {
            res.json(t.scrub(timeslot))
        })
    })

router.route('/')
    .get((req, res, next) => {
        Promise.try(() => {
            if (req.query.date) {
                return t.getByDay(new Date(req.query.date))
            } 
            return t.getAll()
        })
        .then((timeslots) => {
            res.json(_.map(timeslots, (timeslot) => {return t.scrub(timeslot)}))
        })
    })

module.exports = router
