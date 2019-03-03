import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import StyledComponent from '../../styledComponents/base'
import SnackbarContent from '../../components/Snackbar/SnackbarContent'
import SnackbarPopUp from '../../components/Snackbar/SnackbarPopUp'

import { Offline, Detector } from 'react-detect-offline'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

class Login extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      savedForm: {
        username: '',
        password: ''
      },
      showError: false,
      shouldRedirect: false
    }
  }

  handleOnChange = (event) => {
    const { name, value } = event.target

    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        [name]: value
      }
    })
  }

  handleOnSubmit = (event) => {
    event.preventDefault()

    const { savedForm } = this.state
    axios.post(`http://localhost:5000/api/auth/login`, { ...savedForm })
      .then(res => {
        if (res.status === 200) {
          this.handleLoginSuccess(savedForm.username)
        }
      })
    
    if (!this.state.shouldRedirect) {
      this.handleLoginFailed()
    }
  }

  handleLoginSuccess = (username) => {
    this.setState({
      ...this.state,
      shouldRedirect: true
    }, () => {
      cookies.set('username', username, { path: '/' })
    })
  }

  handleLoginFailed = () => {
    console.log('Masuk kesini gan')
    this.setState({
      ...this.state,
      showError: true
    })
  }

  handleToRegister = (event) => {
    this.props.history.push('/register');
  }

  handleSnackbarClose = (event) => {
    this.setState({
      ...this.state,
      showError: false
    })
  }

  renderError() {
    return (
      <SnackbarPopUp
        variant="error"
        message="Wrong username or password!"
        onClose={this.handleSnackbarClose} />
    )
  }

  renderRedirect() {
    return <Redirect push to="/home" />
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>
        {(cookies.get('username') || this.state.shouldRedirect) && this.renderRedirect()}
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Offline>
              <SnackbarContent
                variant="warning"
                message="You're offline!" />
            </Offline>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <form className={classes.form} onSubmit={this.handleOnSubmit} /*method="POST"*/ >
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input id="username" name="username" autoComplete="username" autoFocus
                  onChange={this.handleOnChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input name="password" type="password" id="password" autoComplete="current-password"
                  onChange={this.handleOnChange} />
              </FormControl>
              <Detector
                render={({ online }) => (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!online}
                  >
                    Login
                  </Button>
                )}
              />
              <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                  onClick={this.handleToRegister}
              >
                Register
              </Button>
            </form>
          </Paper>
        </main>
        {this.state.showError && this.renderError()}
      </Fragment>
    )
  }
}

export default withStyles(StyledComponent)(Login)
