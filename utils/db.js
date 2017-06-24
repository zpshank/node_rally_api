const Sequelize = require('sequelize')

const sequelize = new Sequelize('signups', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})

const Entry = sequelize.define('entry', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    field: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

const Timeslot = sequelize.define('timeslot', {
    time: {
        type: Sequelize.DATE
    },
    fieldCount: {
        type: Sequelize.INTEGER,
        defaultValue: 3
    }
})

Timeslot.hasMany(Entry, {as: 'Entries'})
Entry.belongsTo(Timeslot)

module.exports = {
    Entry: Entry,
    Timeslot: Timeslot
}
