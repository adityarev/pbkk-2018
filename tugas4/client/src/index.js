import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css'
import App from './routes/App/App'
import AdminHome from './routes/Admin/AdminHome'
import AdminViewGates from './routes/Admin/View/ViewGates'
import AdminViewUsers from './routes/Admin/View/ViewUsers'
import Home from './routes/Home/Home'
import Login from './routes/Login/Login'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/admin" component={AdminHome} />
      <Route path="/admin/gates" component={AdminViewGates} />
      <Route path="/admin/users" component={AdminViewUsers} />
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
    </Switch>
  </Router>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
