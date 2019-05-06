import { Sequelize } from 'sequelize'

const connection_str = 'postgres://pbkk:nuzulcarrykita@localhost:5432/pbkk-gate'
const connection_options = {
    define: {
        imestamps: true
    }
}

export const sequelize = new Sequelize(connection_str,
                                       connection_options)

sequelize.authenticate()
         .then(_ => console.log('Connection established.'))
         .catch(console.error)
