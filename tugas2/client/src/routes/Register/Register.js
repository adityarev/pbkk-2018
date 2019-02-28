import React from 'react'
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

class Register extends React.Component {
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
      isSubmitting: false
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
    
    this.setState({
      ...this.state,
      isSubmitting: !this.state.isSubmitting
    })
  }

  render() {
    const { classes } = this.props

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={this.state.isSubmitting}
            >
              Register
            </Button>
          </form>
        </Paper>
      </main>
    )
  }
}

export default withStyles(StyledComponent)(Register)
