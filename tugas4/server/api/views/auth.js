import { User, Group, Gate, Rules, Log } from '../db/models'
import * as response from '../util/response'
import * as utils from '../util/utils'


const checkRule = (rule, group, gate) => {
    const today = new Date()
    var h = today.getHours()

    var open = rule.open
    var close = rule.close

    if (open > close) {
        close += 24
        h += 24
    }

    if (open <= h && h <= close)
        return today
    else
        throw `Group '${group.name}' are not allow to access '${gate.name}' at this hours`
}


export const login = (req, res) =>
    User.findOne({
            where: {
                username: req.body.username,
                password: req.body.password } })
        .then(utils.assertNotNull)
        .then(user =>
            user.getGroup()
                .then(group =>
                    Gate.findByPk(req.body.gateId)
                        .then(utils.assertNotNull)
                        .then(gate =>
                            Rules.findOne({where: {
                                     groupId: group.id,
                                     gateId: gate.id }})
                                 .then(utils.assertNotNull)
                                 .then(rule => checkRule(rule, group, gate))
                                 .then(_ => Log.create({ userId: user.id, gateId: gate.id })) ) ) )
        .then(response.json(res))
        .catch(response.error(res))
