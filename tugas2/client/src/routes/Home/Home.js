import React from 'react'
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
import { Offline } from 'react-detect-offline'

class Home extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoggingOut: false
    }
  }

  handleLogout = (event) => {
    this.setState({
      ...this.state,
      isLoggingOut: true
    }, () => {
      // Call logout API
      console.log('LoggingOut...')
    })
  }
  
  render() {
    const { classes } = this.props

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Offline>
            <SnackbarContent
              variant="error"
              message="You're offline!" />
          </Offline>
          <Avatar className={classes.avatar}>
            <HomeRounded />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome, User!
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="default"
            className={classes.submit}
            onClick={this.handleLogout}
            disabled={this.state.isLoggingOut}
          >
            Logout
          </Button>
        </Paper>
      </main>
    )
  }
}

export default withStyles(StyledComponent)(Home)
