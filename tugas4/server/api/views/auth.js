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
        throw `Group "${group.name}" are not allowed to access "${gate.name}" at this hours`
}


export const login = async (req, res) => {
    const sendError = (msg) => response.error(res)(msg)

    const body = req.body

    if (body.username == null || body.password == null || body.gateId == null) {
        if (body.username == null)
            sendError('username is required')

        if (body.password == null)
            sendError('password is required')

        if (body.gateId == null)
            sendError('gateId is required')

        return
    }

    const creds = {
        username: body.username,
        password: body.password
    }

    const user = await User.findOne({ where: creds })
                           .then(utils.assertNotNull)
                           .catch(_ => sendError('Invalid credentials'))

    if (user == null)
        return

    const gate = await Gate.findByPk(body.gateId)
                           .then(utils.assertNotNull)
                           .catch(_ => sendError('Invalid gateId'))

    if (gate == null)
        return

    const group = await user.getGroup()

    const rule = await Rules.findOne({ where: { groupId: group.id, gateId: gate.id } })
                            .then(utils.assertNotNull)
                            .catch(_ => sendError(`Group "${group.name}" does not have rules for gate "${gate.name}". Please create one first.`))  // wtf

    if (rule == null)
        return

    try {
        checkRule(rule, group, gate)
        Log.create({ userId: user.id, gateId: gate.id })
           .then(response.json(res))
    } catch (err) {
        sendError(err)
    }
        // .then(user =>
        //     user.getGroup()
        //         .then(group =>
        //             Gate.findByPk(req.body.gateId)
        //                 .then(utils.assertNotNull)
        //                 .then(gate =>
        //                     Rules.findOne({where: {
        //                              groupId: group.id,
        //                              gateId: gate.id }})
        //                          .then(utils.assertNotNull)
        //                          .then(rule => checkRule(rule, group, gate))
        //                          .then(_ => Log.create({ userId: user.id, gateId: gate.id })) ) ) )
        // .then(response.json(res))
        


}
