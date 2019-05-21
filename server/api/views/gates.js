import { Gate } from '../db/models'
import * as response from '../util/response'


export const all = (req, res) =>
    Gate.findAll({ where: req.query, raw: true })
        .then(response.json(res))
        .catch(response.error(res))


export const create = (req, res) =>
    Gate.create(req.body, { raw: true })
        .then(response.json(res))
        .catch(response.error(res))


export const details = (req, res) =>
    Gate.findByPk(req.params.id, { raw: true })
        .then(response.jsonOr404(res))
        .catch(response.error(res))


export const destroy = (req, res) =>
    Gate.destroy({ where: req.params, raw: true})
        .then(response.json(res))
        .catch(response.error(res))
