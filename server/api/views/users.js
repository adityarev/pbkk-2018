import { User } from '../db/models'
import * as response from '../util/response'


export const all = (req, res) =>
    User.findAll({ where: req.query, raw: true })
        .then(response.json(res))
        .catch(response.error(res))


export const create = (req, res) =>
    User.create(req.body, { raw: true })
        .then(response.json(res))
        .catch(response.error(res))


export const details = (req, res) =>
    User.findByPk(req.params.id, { raw: true })
        .then(response.jsonOr404(res))
        .catch(response.error(res))


export const destroy = (req, res) =>
    User.destroy({ where: req.params, raw: true})
        .then(response.json(res))
        .catch(response.error(res))
