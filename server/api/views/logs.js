import { Log } from '../db/models'
import * as response from '../util/response'


export const all = (req, res) =>
    Log.findAll({ where: req.query, raw: true })
       .then(response.json(res))
       .catch(response.error(res))


export const create = (req, res) =>
    Log.create(req.body, { raw: true })
       .then(response.json(res))
       .catch(response.error(res))


export const details = (req, res) =>
    Log.findByPk(req.params.id, { raw: true })
       .then(response.jsonOr404(res))
       .catch(response.error(res))
