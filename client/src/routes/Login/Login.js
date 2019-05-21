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

import { BACKEND_SERVER } from '../../constants/constants'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import LoginStyledComponent from '../../styledComponents/login'
import SnackbarPopUp from '../../components/Snackbar/SnackbarPopUp'

const cookies = new Cookies()

class Login extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      hasError: {
        gateIdRequired: false
      },
      gates: [],
      savedForm: {
        username: '',
        password: '',
        gateId: 0
      },
      snackbar: {
        isActive: false,
        message: "",
        variant: ""
      },
      shouldRedirect: false
    }
  }

  componentDidMount() {
    axios.get(`${BACKEND_SERVER}/gates`, {})
      .then(res => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            gates: res.data.result
          })
        }
      })
      .catch(error => {
        if (error.response) {
          this.handleRequestFailed(error.response.data.message)
        } else if (error.request) {
          this.handleRequestFailed('Can\'t connect to server!')
        } else {
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
  }

  checkErrorRequired = (callback) => {
    const { gateId } = this.state.savedForm

    this.setState({
      ...this.state,
      hasError: {
        ...this.state.hasError,
        gateRequired: false
      }
    }, () => {
      if (gateId === 0) {
        this.setState({
          ...this.state,
          hasError: {
            ...this.state.hasError,
            gateIdRequired: true
          }
        })
      } else {
        callback()
      }
    })
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
    this.checkErrorRequired(() => {
      if (!this.state.hasError.gateIdRequired) {
        const { savedForm, gates } = this.state
        axios.post(`${BACKEND_SERVER}/auth/login`, { ...savedForm })
          .then(res => {
            if (res.status === 200) {
              const { username } = savedForm
              const gateName = gates.find(gate => gate.id === savedForm.gateId).name

              this.handleLoginSuccess(username, gateName)
            }
          })
          .catch(error => {
            if (error.response) {
              this.handleRequestFailed(error.response.data.messages)
            } else if (error.request) {
              this.handleRequestFailed('Can\'t connect to server!')
            } else {
              console.log('Error', error.message)
            }
            console.log(error.config)
          })
      }
    })
  }

  handleLoginSuccess = (username, gate) => {
    this.setState({
      ...this.state,
      shouldRedirect: true
    }, () => {
      cookies.set('username', username, { path: '/' })
      cookies.set('gate', gate, { path: '/' })
    })
  }

  handleRequestFailed = (message) => {
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
                <Input name="password" type="password" id="password" autoComplete="password"
                  onChange={this.handleOnChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="gateId">Gate</InputLabel>
                <Select
                  value={this.state.savedForm.gateId}
                  onChange={this.handleOnChange}
                  name="gateId"
                  inputProps={{
                    id: 'gateId',
                  }}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={0}>
                    <em>None</em>
                  </MenuItem>
                  {
                    this.state.gates.map(gate => <MenuItem key={gate.id} value={gate.id}>{gate.name}</MenuItem>)
                  }
                </Select>
                {this.state.hasError.gateIdRequired && <FormHelperText>Required</FormHelperText>}
              </FormControl>
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Login
                </Button>
            </form>
          </Paper>
        </main>
        {this.state.snackbar.isActive && this.renderSnackbar()}
      </Fragment>
    )
  }
}

export default withStyles(LoginStyledComponent)(Login)
