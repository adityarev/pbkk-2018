import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import HomeRounded from '@material-ui/icons/HomeRounded'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'
import HomeStyledComponent from '../../styledComponents/home'
// import SnackbarContent from '../../components/Snackbar/SnackbarContent'

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
      cookies.remove('nrp')
      cookies.remove('gate')
    })
  }

  renderRedirect() {
    return (this.state.shouldRedirect || !cookies.get('nrp')) && <Redirect push to="/login" />
  }
  
  render() {
    const { classes } = this.props

    return (
      this.renderRedirect() ||
      <Fragment>
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <HomeRounded />
            </Avatar>
            <Typography component="h1" variant="h5">
              Hi, {cookies.get('nrp')}. Welcome to {cookies.get('gate')}!
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="default"
              className={classes.submit}
              onClick={this.handleLogout}
            >
              Logout
            </Button>
          </Paper>
        </main>
      </Fragment>
    )
  }
}

export default withStyles(HomeStyledComponent)(Home)
