import * as auth from './api/views/auth'
import * as gates from './api/views/gates'
import * as groups from './api/views/groups'
import * as users from './api/views/users'
import * as rules from './api/views/rules'
import * as logs from './api/views/logs'


export const initialize_endpoints = app => {
    
    app.post('/auth/login', auth.login)

    app.get('/gates', gates.all)
    app.post('/gates', gates.create)
    app.get('/gates/:id', gates.details)
    app.delete('/gates/:id', gates.destroy)

    app.get('/groups', groups.all)
    app.post('/groups', groups.create)
    app.get('/groups/:id', groups.details)
    app.delete('/groups/:id', groups.destroy)

    app.get('/users', users.all)
    app.post('/users', users.create)
    app.get('/users/:id', users.details)
    app.delete('/users/:id', users.destroy)

    app.get('/rules', rules.all)
    app.post('/rules', rules.create)
    app.get('/rules/:id', rules.details)
    app.delete('/rules/:id', rules.destroy)

    app.get('/logs', logs.all)
    app.post('/logs', logs.create)
    app.get('/logs/:id', logs.details)
}
