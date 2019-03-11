import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import HomeRounded from '@material-ui/icons/HomeRounded'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import StyledComponent from '../../styledComponents/base'
import SnackbarContent from '../../components/Snackbar/SnackbarContent'
import SnackbarPopUp from '../../components/Snackbar/SnackbarPopUp'

import { Offline, Detector } from 'react-detect-offline'
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'

const cookies = new Cookies()

class Home extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      snackbar: {
        isActive: false,
        message: '',
        variant: ''
      }
    }
  }

  handleLogoutClick = (event) => {
    axios.post(`http://localhost:5000/api/auth/logout`, {
      username: cookies.get('username')
    })
      .then(res => {
        if (res.status === 200) {
          this.handleLogoutSuccess()
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
          this.handleLogoutFailed('Wrong request!')
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('Error request')
          this.handleLogoutFailed('Server doesn\'t give any response!')
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
  }

  handleLogoutSuccess = () => {
    cookies.remove('username')
    this.props.history.push('/login');
  }

  handleLogoutFailed = (message) => {
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
    return <Redirect push to="/login" />
  }
  
  render() {
    const { classes } = this.props

    return (
      <Fragment>
        {!cookies.get('username') && this.renderRedirect()}
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Offline>
              <SnackbarContent
                variant="warning"
                message="You're offline!" />
            </Offline>
            <Avatar className={classes.avatar}>
              <HomeRounded />
            </Avatar>
            <Typography component="h1" variant="h5">
              Welcome, {cookies.get('username')}!
            </Typography>
            <Detector
              render={({ online }) => (
                <Button
                  fullWidth
                  variant="contained"
                  color="default"
                  className={classes.submit}
                  onClick={this.handleLogoutClick}
                  disabled={this.state.isLoggingOut || !online}
                >
                  Logout
                </Button>
              )}
            />
          </Paper>
        </main>
        {this.state.snackbar.isActive && this.renderSnackbar()}
      </Fragment>
    )
  }
}

export default withStyles(StyledComponent)(Home)
