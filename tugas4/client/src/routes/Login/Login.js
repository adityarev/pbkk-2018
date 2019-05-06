import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select';
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
        password: '',
        gate: ''
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
    axios.post(`http://localhost:5000/login`, { ...savedForm })
      .then(res => {
        console.log(res)

        if (res.status === 200) {
          this.handleLoginSuccess(savedForm.username)
        }
      })
      .catch(error => {
        if (error.response) {
          this.handleLoginFailed(error.response.data.message)
        } else if (error.request) {
          this.handleLoginFailed('Can\'t connect to server!')
        } else {
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
              Login Gate
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
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="gate-required">Gate</InputLabel>
                <Select
                  value={this.state.savedForm.gate}
                  onChange={this.handleOnChange}
                  name="gate"
                  inputProps={{
                    id: 'gate-required',
                  }}
                  className={classes.selectEmpty}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"1"}>Gate 1</MenuItem>
                  <MenuItem value={"2"}>Gate 2</MenuItem>
                  <MenuItem value={"3"}>Gate 3</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
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
            </form>
          </Paper>
        </main>
        {this.state.snackbar.isActive && this.renderSnackbar()}
      </Fragment>
    )
  }
}

export default withStyles(StyledComponent)(Login)
