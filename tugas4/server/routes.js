import * as auth from './api/views/auth'
import * as gates from './api/views/gates'
import * as groups from './api/views/groups'
import * as users from './api/views/users'
import * as rules from './api/views/rules'
import * as logs from './api/views/logs'


export const initialize_endpoints = app => {
    
    app.post('/api/auth/login', auth.login)

    app.get('/api/gates', gates.all)
    app.post('/api/gates', gates.create)
    app.get('/api/gates/:id', gates.details)
    app.delete('/api/gates/:id', gates.destroy)

    app.get('/api/groups', groups.all)
    app.post('/api/groups', groups.create)
    app.get('/api/groups/:id', groups.details)
    app.delete('/api/groups/:id', groups.destroy)

    app.get('/api/users', users.all)
    app.post('/api/users', users.create)
    app.get('/api/users/:id', users.details)
    app.delete('/api/users/:id', users.destroy)

    app.get('/api/rules', rules.all)
    app.post('/api/rules', rules.create)
    app.get('/api/rules/:id', rules.details)
    app.delete('/api/rules/:id', rules.destroy)

    app.get('/api/logs', logs.all)
    app.post('/api/logs', logs.create)
    app.get('/api/logs/:id', logs.details)
}
