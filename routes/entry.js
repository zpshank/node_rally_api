const _ = require('lodash'),
    Promise = require('bluebird'),
    express = require('express'),
    router = express.Router(),
    entry = require('../controller/entry')

router.route('/:id')
    .get((req, res) => {
        return entry.getById(req.params.id)
        .then((entry) => {
            res.json(entry.toJSON())
        })
    })
    .delete((req, res) => {
        return entry.removeById(req.params.id)
        .then((count) => {
            res.json({removed: count})
        })
    })

router.route('/')
    .get((req, res) => {
        Promise.try(() => {
            if (req.query.date) {
                return entry.getByDay(new Date(req.query.date))
            }
            return entry.getAll()
        })
        .then((entries) => {
            res.json(_.map(entries, (entry) => {return entry.toJSON()}))
        })
    })

module.exports = router
