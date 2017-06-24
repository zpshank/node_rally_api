const _ = require('lodash'),
    Promise = require('bluebird'),
    Sequelize = require('sequelize'),
    Timeslot = require('../utils/db').Timeslot,
    Entry = require('../utils/db').Entry,
    e = require('./entry')

module.exports = {
    getAll: function() {
        return Timeslot.findAll({
            include: ['Entries'],
            order: [
                ['time', 'ASC']
            ]                
        })
    },
    getById: function(id) {
        return Timeslot.findById(id, {
            include: ['Entries']
        })
    },
    getByDay: function(date) {
        date.setHours(0,0,0,0)
        let next_day = new Date(date.getTime())
        next_day.setDate(next_day.getDate() + 1)
        return Timeslot.findAll({
            where: {
                time: {
                    $gte: date,
                    $lt: next_day
                }
            },
            include: ['Entries'],
            order: [
                ['time', 'ASC']
            ]
        })
    },
    scrub: function(timeslot) {
        return {
            time: timeslot.get('time'),
            fieldCount: timeslot.get('fieldCount'),
            entries: _.map(timeslot.get('Entries'), (entry) => { return e.scrub(entry) })
        }
    },
    getDays: function(tz) {
        return Timeslot.findAll({
            attributes: [ [Sequelize.fn('date', Sequelize.fn('convert_tz', Sequelize.col('time'), '+00:00', tz || '+00:00')), 'days']],
            group: ['days']
        })
        .then((results) => {
            return Promise.resolve({
                days: _.map(results, (r) => { return r.get('days') })
            })
        })
    }
}
