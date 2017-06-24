const _ = require('lodash'),
    Promise = require('bluebird'),
    Entry = require('./db').Entry,
    Timeslot = require('./db').Timeslot

const hour_inc = 1,
    minute_inc = 15,
    max_days = 2

let d = new Date()
d.setHours(7, 30, 0, 0)

let times = []
for (i = 0; i < max_days; i++) {
    while(d.getHours() < 21) {
        times.push(new Date(d.getTime()))
        d.setHours(d.getHours() + hour_inc);
        d.setMinutes(d.getMinutes() + minute_inc);
    }    
    // Set to new day
    d.setDate(d.getDate() + 1)

    // Reset to 07:30
    d.setHours(7, 30, 0, 0)
}


module.exports = {
    run: function() {
        let timeslots
        return Entry.drop()
        .then(() => {
            return Timeslot.sync({force:true})
        })
        .then(() => {
            return Promise.map(times, (time) => {
                return Timeslot.create({
                    time: time
                })
            })
        })
        .then((ts) => {
            timeslots = ts
            return Entry.sync({force: true})
        })
        .then(() => {
            return Entry.create({
                firstName: 'John',
                lastName: 'Hancock',
                email: 'jh@blah.com',
                phone: '555-555-5555',
                field: 1
            })
            .then((entry) => {
                return entry.setTimeslot(timeslots[0])
            })
        })
    }
}
