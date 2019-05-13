import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import DeleteIcon from '@material-ui/icons/DeleteRounded'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import EditIcon from '@material-ui/icons/EditRounded'
import Fab from '@material-ui/core/Fab'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InfoIcon from '@material-ui/icons/Info'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

import { BACKEND_SERVER } from '../../../constants/constants'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import AdminViewUsersStyledComponent from '../../../styledComponents/adminViewUsers'
import SnackbarPopUp from '../../../components/Snackbar/SnackbarPopUp'

const cookies = new Cookies()

class AdminViewUsers extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      groups:[],
      users: [],
      redirect: {
        isActive: false,
        link: ''
      },
      dialog: {
        isActive: false,
        key: ''
      },
      hasError: {
        // matchRetype: false,
        groupIdRequired: false,
      },
      savedForm: {
        userId: '',
        username: '',
        password: '',
        retype: '',
        groupId: '',
        groupName: ''
      },
      snackbar: {
        isActive: false,
        message: "",
        variant: ""
      },
    }
  }

  componentDidMount() {
    axios.get(`${BACKEND_SERVER}/api/users`, {})
      .then(res => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            users: res.data.result.sort((a, b) => (a.id < b.id ? -1 : 1))
          }, () => {
            axios.get(`${BACKEND_SERVER}/api/groups`, {})
              .then(res => {
                if (res.status === 200) {
                  this.setState({
                    ...this.state,
                    groups: res.data.result.sort((a, b) => (a.id < b.id ? -1 : 1))
                  })
                }
              })
              .catch(error => {
                if (error.response) {
                  this.handleRequestFailed(error.response.data.message)
                } else if (error.request) {
                  this.handleRequestFailed('Can\'t fetch groups from server!')
                } else {
                  console.log('Error', error.message)
                }
                console.log(error.config)
              })
          })
        }
      })
      .catch(error => {
        if (error.response) {
          this.handleRequestFailed(error.response.data.message)
        } else if (error.request) {
          this.handleRequestFailed('Can\'t fetch users from server!')
        } else {
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
  }

  handleAddClick = () => {
    this.setState({
      ...this.state,
      savedForm: {
        username: '',
        password: '',
        retype: '',
        userId: '',
        groupId: ''
      },
      dialog: {
        isActive: true,
        key: 'add'
      }
    })
  }

  handleAddSubmit = () => {
    const { savedForm } = this.state

    this.checkErrorRequired(() => {
      this.checkErrorRetype(() => {
        axios.post(`${BACKEND_SERVER}/api/users`, { ...savedForm })
          .then(res => {
            if (res.status === 200) {
              window.location.reload()
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
      })
    })
  }

  handleDeleteClick = (userId) => {
    const { users } = this.state
    const user = users.find(user => user.id === userId)

    console.log(user)

    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        userId: userId.toString(10),
        username: user.username,
        groupId: user.groupId.toString(10)
      },
      dialog: {
        isActive: true,
        key: 'delete'
      }
    })
  }

  handleDeleteSubmit = () => {
    const { savedForm } = this.state
    axios.delete(`${BACKEND_SERVER}/api/users/${savedForm.userId}`, {})
      .then(res => {
        if (res.status === 200) {
          window.location.reload()
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

  handleEditClick = (userId) => {
    const { users } = this.state
    const user = users.find(user => user.id === userId)

    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        userId: userId.toString(10),
        username: user.username,
        password: '',
        retype: '',
        groupId: user.groupId
      },
      dialog: {
        isActive: true,
        key: 'edit'
      }
    })
  }

  handleEditSubmit = () => {
    console.log('Submitting edit form ...')
  }

  handleDialogClose = () => {
    this.setState({
      ...this.state,
      dialog: {
        ...this.state.dialog,
        isActive: false
      }
    })
  }

  checkErrorRequired = (callback) => {
    const { groupId } = this.state.savedForm

    this.setState({
      ...this.state,
      hasError: {
        ...this.state.hasError,
        groupIdRequired: false
      }
    }, () => {
      if (groupId === '0') {
        this.setState({
          ...this.state,
          hasError: {
            ...this.state.hasError,
            groupIdRequired: true
          }
        })
      } else {
        callback()
      }
    })
  }

  checkErrorRetype = (callback) => {
    const { password, retype } = this.state.savedForm

    this.setState({
      ...this.state,
      snackbar: {
        isActive: false,
        message: ''
      }
    }, () => {
      if (password !== retype) {
        this.handleRequestFailed('Password doesn\'t match!')
      } else {
        callback()
      }
    })
  }

  handleGoHome = (event) => {
    this.setState({
      ...this.state,
      redirect: {
        isActive: true,
        link: '/admin'
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

  renderAddDialog = (classes) => {
    return (
      <Dialog
          open={true}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New User</DialogTitle>
          <DialogContent>
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
                <InputLabel htmlFor="retype">Re-type Password</InputLabel>
                <Input name="retype" type="password" id="retype" autoComplete="retype"
                  onChange={this.handleOnChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="groupId">Group</InputLabel>
                <Select
                  value={this.state.savedForm.groupId}
                  onChange={this.handleOnChange}
                  name="groupId"
                  inputProps={{
                    id: 'groupId',
                  }}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={'0'}>
                    <em>None</em>
                  </MenuItem>
                  {
                    this.state.groups.map(group => <MenuItem key={group.id} value={group.id.toString(10)}>{group.name}</MenuItem>)
                  }
                </Select>
                {this.state.hasError.groupIdRequired && <FormHelperText>Required</FormHelperText>}
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleAddSubmit} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
    )
  }

  renderDeleteDialog = () => {
    const { groups, savedForm } = this.state
    const group = groups.find(group => group.id.toString(10) === savedForm.groupId)

    return (
      <Dialog
          open={true}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Delete User?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              User named '{savedForm.username}' at group '{group.name}' will be deleted. Are you sure?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteSubmit} color="secondary">
              Yes
            </Button>
            <Button onClick={this.handleDialogClose} color="primary">
              No
            </Button>
          </DialogActions>
        </Dialog>
    )
  }

  renderEditDialog = (classes) => {
    const { savedForm } = this.state

    return (
      <Dialog
          open={true}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
          <DialogContent>
          <form className={classes.form} onSubmit={this.handleOnSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input id="username" name="username" autoComplete="username" autoFocus
                  value={savedForm.username}
                  onChange={this.handleOnChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input name="password" type="password" id="password" autoComplete="password"
                  onChange={this.handleOnChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="retype">Re-type Password</InputLabel>
                <Input name="retype" type="password" id="retype" autoComplete="retype"
                  onChange={this.handleOnChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="groupId">Group</InputLabel>
                <Select
                  value={savedForm.groupId}
                  onChange={this.handleOnChange}
                  name="groupId"
                  inputProps={{
                    id: 'groupId',
                  }}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={'0'}>
                    <em>None</em>
                  </MenuItem>
                  {
                    this.state.groups.map(group => <MenuItem key={group.id} value={group.id.toString(10)}>{group.name}</MenuItem>)
                  }
                </Select>
                {this.state.hasError.groupIdRequired && <FormHelperText>Required</FormHelperText>}
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleEditSubmit} color="primary" disabled>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
    )
  }

  renderDialog = (classes) => {
    const { key } = this.state.dialog

    switch (key) {
      case 'add':
        return this.renderAddDialog(classes)
      case 'edit':
        return this.renderEditDialog(classes)
      case 'delete':
        return this.renderDeleteDialog()
      default:
        return <div></div>
    }
  }

  renderRedirect = () => {
    return false ||
      (!cookies.get('username') && <Redirect push to="/login" />) ||
      (this.state.redirect.isActive && <Redirect push to={this.state.redirect.link} />)
  }

  renderSnackbar = () => {
    return (
      <SnackbarPopUp
        variant={this.state.snackbar.variant}
        message={this.state.snackbar.message}
        onClose={this.handleSnackbarClose} />
    )
  }
  
  render() {
    const { classes } = this.props
    const { users, groups } = this.state

    if (users.length === 0 || groups.length === 0) {
      return <div></div>
    }

    return (
      this.renderRedirect() ||
      <Fragment>
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <InfoIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              User List
            </Typography>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Group</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.id}
                    </TableCell>
                    <TableCell align="left">{user.username}</TableCell>
                    <TableCell align="left">{groups.find(group => group.id === user.groupId).name}</TableCell>
                    <TableCell align="left">
                      <EditIcon onClick={() => this.handleEditClick(user.id)} />
                      <DeleteIcon onClick={() => this.handleDeleteClick(user.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Fab color="primary" aria-label="Add" className={classes.fab}>
              <AddIcon onClick={() => this.handleAddClick()}/>
            </Fab>
            <Button
              fullWidth
              variant="contained"
              color="default"
              className={classes.submit}
              onClick={this.handleGoHome}
            >
              BACK TO HOME
            </Button>
          </Paper>
        </main>
        {this.state.snackbar.isActive && this.renderSnackbar()}
        {this.state.dialog.isActive && this.renderDialog(classes)}
      </Fragment>
    )
  }
}

export default withStyles(AdminViewUsersStyledComponent)(AdminViewUsers)
