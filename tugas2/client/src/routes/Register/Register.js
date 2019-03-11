import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import StyledComponent from '../../styledComponents/base'
import SnackbarContent from '../../components/Snackbar/SnackbarContent'
import SnackbarPopUp from '../../components/Snackbar/SnackbarPopUp'

import { Offline, Detector } from 'react-detect-offline'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

class Register extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      savedForm: {
        username: '',
        password: '',
        retype: ''
      },
      snackbar: {
        isActive: false,
        message: '',
        variant: ''
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

  handleOnSubmit = async (event) => {
    event.preventDefault()
    
    const { savedForm } = this.state
    if (savedForm.password !== savedForm.retype) {
      console.log('Password not match')
      this.setState({
        ...this.state,
        snackbar: {
          isActive: true,
          message: 'Password doesn\'t match!',
          variant: 'error'
        }
      })
    } else {
      let form = {}
      form.username = savedForm.username
      form.password = savedForm.password
      
      await axios.post(`http://localhost:5000/api/auth/register`, { ...form })
      .then(res => {
        if (res.status === 200) {
          this.handleRegisterSuccess()
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
          this.handleRegisterFailed('Username already exist!')
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('Error request')
          this.handleRegisterFailed('Server doesn\'t give any response!')
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      console.log(error.config);
      })
    }
  }

  handleRegisterSuccess = () => {
    this.setState({
      ...this.state,
      shouldRedirect: true,
      snackbar: {
        isActive: true,
        message: 'User registered!',
        variant: 'success'
      }
    })
  }

  handleRegisterFailed = (message) => {
    this.setState({
      ...this.state,
      snackbar: {
        isActive: true,
        message: message,
        variant: 'error'
      }
    })
  }

  handleSnackbarClose = (event) => {
    this.setState({
      ...this.state,
      snackbar: {
        isActive: false,
        message: '',
        variant: ''
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
    console.log('redirect to login...')
    return <Redirect push to="/login" />
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>
        {this.state.shouldRedirect && this.renderRedirect()}
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Offline>
              <SnackbarContent
                variant="warning"
                message="You're offline!" />
            </Offline>
            <Avatar className={classes.avatar}>
              <AccountCircle />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
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
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="retype">Retype Password</InputLabel>
                <Input name="retype" type="password" id="retype" autoComplete="retype-password"
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
                    Register
                  </Button>
                )}
              />
            </form>
          </Paper>
        </main>
        {this.state.snackbar.isActive && this.renderSnackbar()}
      </Fragment>
    )
  }
}

export default withStyles(StyledComponent)(Register)
