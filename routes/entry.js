const _ = require('lodash'),
    Promise = require('bluebird'),
    express = require('express'),
    router = express.Router(),
    e = require('../controller/entry')

router.route('/:id')
    .get((req, res) => {
        return e.getById(req.params.id)
        .then((entry) => {
            res.json({
                name: entry.get('firstName') + ' ' + entry.get('lastName').toUpperCase()[0] + '.',
                field: entry.get('field'),
                timeslotId: entry.get('timeslotId')
            })
        })
    })

router.route('/')
    .get((req, res) => {
        Promise.try(() => {
            if (req.query.date) {
                return e.getByDate(new Date(req.query.date))
            }
            return e.getAll()
        })
        .then((entries) => {
            res.json(_.map(entries, (entry) => { return e.scrub(entry) }))
        })
    })
    .put((req, res) => {
        return e.create(req.body)
        .then((entry) => {
            res.json(e.scrub(entry))
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err.message})
        })
    })

module.exports = router
