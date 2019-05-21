import { Sequelize } from 'sequelize'

const connection_str = 'postgres://pbkk:nuzulcarrykita@45.32.99.52:5432/pbkk-gate'
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
