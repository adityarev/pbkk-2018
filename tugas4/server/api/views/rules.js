import { Rules } from '../db/models'
import * as response from '../util/response'


export const all = (req, res) =>
    Rules.findAll({ where: req.query, raw: true })
         .then(response.json(res))
         .catch(response.error(res))


export const create = (req, res) =>
    Rules.create(req.body, { raw: true })
         .then(response.json(res))
         .catch(response.error(res))


export const details = (req, res) =>
    Rules.findByPk(req.params.id, { raw: true })
         .then(response.jsonOr404(res))
         .catch(response.error(res))


export const destroy = (req, res) =>
    Rules.destroy({ where: req.params, raw: true})
         .then(response.json(res))
         .catch(response.error(res))
