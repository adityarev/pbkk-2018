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

import { Offline, Detector } from 'react-detect-offline'
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

class Home extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      shouldRedirect: false
    }
  }

  handleLogout = (event) => {
    this.setState({
      ...this.state,
      shouldRedirect: true
    }, () => {
      cookies.remove('username')
    })
  }

  renderRedirect() {
    return (this.state.shouldRedirect || !cookies.get('username')) && <Redirect push to="/login" />
  }
  
  render() {
    const { classes } = this.props

    return (
      this.renderRedirect() ||
      <Fragment>
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
                  onClick={this.handleLogout}
                  disabled={!online}
                >
                  Logout
                </Button>
              )}
            />
          </Paper>
        </main>
      </Fragment>
    )
  }
}

export default withStyles(StyledComponent)(Home)
