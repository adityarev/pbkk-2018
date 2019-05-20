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
        gateRequired: false
      },
      gates: [],
      savedForm: {
        nrp: '',
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

  componentDidMount() {
    axios.get(`${BACKEND_SERVER}/gates`, {})
      .then(res => {
        if (res.status === 200) {
          const { error, message } = res.data

          if (error === 0) {
            this.setState({
              ...this.state,
              gates: message
            })
          } else {
            this.handleRequestFailed(message)
          }
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
    const { gate } = this.state.savedForm

    this.setState({
      ...this.state,
      hasError: {
        ...this.state.hasError,
        gateRequired: false
      }
    }, () => {
      if (gate === '') {
        this.setState({
          ...this.state,
          hasError: {
            ...this.state.hasError,
            gateRequired: true
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
      if (!this.state.hasError.gateRequired) {
        const { savedForm } = this.state
        axios.post(`${BACKEND_SERVER}/login`, { ...savedForm })
          .then(res => {
            if (res.status === 200) {
              const { nrp, gate } = savedForm
              this.handleLoginSuccess(nrp, gate)
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
    })
  }

  handleLoginSuccess = (nrp, gate) => {
    this.setState({
      ...this.state,
      shouldRedirect: true
    }, () => {
      cookies.set('nrp', nrp, { path: '/' })
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
        {(cookies.get('nrp') || this.state.shouldRedirect) && this.renderRedirect()}
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
                <InputLabel htmlFor="nrp">NRP</InputLabel>
                <Input id="nrp" name="nrp" autoComplete="nrp" autoFocus
                  onChange={this.handleOnChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input name="password" type="password" id="password" autoComplete="password"
                  onChange={this.handleOnChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="gate">Gate</InputLabel>
                <Select
                  value={this.state.savedForm.gate}
                  onChange={this.handleOnChange}
                  name="gate"
                  inputProps={{
                    id: 'gate',
                  }}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={''}>
                    <em>None</em>
                  </MenuItem>
                  {
                    this.state.gates.map(gate => <MenuItem key={gate.id} value={gate.gate}>{gate.gate}</MenuItem>)
                  }
                </Select>
                {this.state.hasError.gateRequired && <FormHelperText>Required</FormHelperText>}
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
