import React from 'react'
import PropTypes from 'prop-types'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import Snackbar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'
import SnackbarContent from './SnackbarContent'

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
})

class SnackbarPopUp extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      open: true
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ open: false }, () => {
      if (this.props.onClose) {
        this.props.onClose()
      }
    })
  }

  render() {
    return (
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <SnackbarContent
            onClose={this.handleClose}
            variant={this.props.variant || 'info'}
            message={this.props.message || 'Info'}
          />
        </Snackbar>
    )
  }
}

export default withStyles(styles)(SnackbarPopUp)
