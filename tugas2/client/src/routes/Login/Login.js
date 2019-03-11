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
      snackbar: {
        isActive: false,
        message: "",
        variant: ""
      },
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
      .catch(error => {
        // Error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          console.log('Error response')
          this.handleLoginFailed('Username already exist!')
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('Error request')
          this.handleLoginFailed('Server doesn\'t give any response!')
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
  }

  handleLoginSuccess = (username) => {
    this.setState({
      ...this.state,
      shouldRedirect: true
    }, () => {
      cookies.set('username', username, { path: '/' })
    })
  }

  handleLoginFailed = (message) => {
    this.setState({
      ...this.state,
      snackbar: {
        isActive: true,
        message: message,
        variant: 'error'
      }
    })
  }

  handleToRegister = (event) => {
    this.props.history.push('/register');
  }

  handleSnackbarClose = (event) => {
    this.setState({
      ...this.state,
      snackbar: {
        isActive: false,
        message: "",
        variant: ""
      }
    })
  }

  renderSnackbar = () => {
    return (
      <SnackbarPopUp
        variant={this.state.snackbar.variant}
        message={this.state.snackbar.message}
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
            <form className={classes.form} onSubmit={this.handleOnSubmit}>
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
        {this.state.snackbar.isActive && this.renderSnackbar()}
      </Fragment>
    )
  }
}

export default withStyles(StyledComponent)(Login)
