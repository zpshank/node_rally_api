const Timeslot = require('../utils/db').Timeslot

module.exports = {
    getAll: function() {
        return Timeslot.findAll({
            order: [
                ['time', 'ASC']
            ]                
        })
    }
}
