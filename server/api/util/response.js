import { Sequelize } from 'sequelize'
import * as utils from './utils'


export const json = res => {
    return message => {
        if (message === null)
            message = 'OK'
        res.status(200).json({ result: message })
    }
}


export const jsonOr404 = res => {
    return message => {
        if (message === null)
            res.status(404).json({ result: 'Not found' })
        else
            res.status(200).json({ result: message })
    }
}


export const success = res => {
    return () =>
        res.status(200).json({ status: 'OK' })
}


export const error = res => {
    return error => {
        res.status(400).json({ messages: utils.parseError(error) })
    }
}
