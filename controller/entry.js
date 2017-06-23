const Entry = require('../utils/db').Entry,
    Timeslot = require('../utils/db').Timeslot

module.exports = {
    getAll: function() {
        return Entry.findAll()
    },
    getById: function(id) {
        return Entry.findById(id)
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
    }
}
