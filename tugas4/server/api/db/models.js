import { Sequelize } from 'sequelize'
import { sequelize } from './conn'


// define models

export const Group = sequelize.define('group', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
})


export const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})


export const Gate = sequelize.define('gate', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
})


export const Rules = sequelize.define('rule', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    open: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    close: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gateId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})


export const Log = sequelize.define('log', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gateId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})


// define associations

User.belongsTo(Group)

Group.belongsToMany(Gate, { through: Rules })
Gate.belongsToMany(Group, { through: Rules })

User.hasMany(Log)
Gate.hasMany(Log)
