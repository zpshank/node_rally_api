const _ = require('lodash'),
    Promise = require('bluebird'),
    Entry = require('../utils/db').Entry,
    Timeslot = require('../utils/db').Timeslot

module.exports = {
    getAll: function() {
        return Entry.findAll({
            include: [Timeslot]                    
        })
    },
    getById: function(id) {
        return Entry.findById(id, {
            include: [Timeslot]                     
        })
    },
    removeById: function(id) {
        return Entry.destroy({
            where: {
                id: id
            }
        })
    },
    getByDay: function(date) {
        date.setHours(0,0,0,0)
        let next_day = new Date(date.getTime())
        next_day.setDate(next_day.getDate() + 1)
        return Entry.findAll({
            include: [{
                model: Timeslot,
                where: {
                    time: {
                        $gte: date,
                        $lt: next_day
                    }
                }
            }]
        })
    },
    scrub: function(entry) {
        return {
            name: entry.get('firstName') + ' ' + entry.get('lastName').toUpperCase()[0] + '.',
            field: entry.get('field'),
            timeslotId: entry.get('timeslotId')
        }
    },
    create: function(params) {
        return Timeslot.findById(params.timeslotId, {
            include: ['Entries']
        })
        .then((timeslot) => {
            if (!timeslot)
                return Promise.reject(new Error("Invalid timeslot. Please choose a valid one."))
            if (timeslot.get('Entries').length >= timeslot.get('fieldCount'))
                return Promise.reject(new Error("Timeslot is full. Please choose another one."))
            // Don't allow excess fields
            if (params.field > timeslot.get('fieldCount'))
                return Promise.reject(new Error("Invalid field. Please choose a valid one."))
            // Don't allow duplicates
            if (_.find(timeslot.get('Entries'), (entry) => {return entry.field == params.field}))
                return Promise.reject(new Error("Field already taken for timeslot. Please choose another one."))

            return Entry.create(params)
        })
    }
}
