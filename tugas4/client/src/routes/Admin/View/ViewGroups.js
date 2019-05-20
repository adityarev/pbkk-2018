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
import Fab from '@material-ui/core/Fab'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
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
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

import { BACKEND_SERVER } from '../../../constants/constants'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import AdminViewGroupsStyledComponent from '../../../styledComponents/adminViewGroups'
import SnackbarPopUp from '../../../components/Snackbar/SnackbarPopUp'

const cookies = new Cookies()

class AdminViewGroups extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      groups: [],
      redirect: {
        isActive: false,
        link: ''
      },
      dialog: {
        isActive: false,
        key: ''
      },
      hasError: {
        groupRequired: false,
        gateRequired: false
      },
      savedForm: {
        id: 0,
        group: '',
        gate: '',
      },
      snackbar: {
        isActive: false,
        message: "",
        variant: ""
      },
    }
  }

  componentDidMount() {
    axios.get(`${BACKEND_SERVER}/groups`, {})
      .then(res => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            groups: res.data.message.sort((a, b) => (a.id < b.id ? -1 : 1))
          }, () => {
            axios.get(`${BACKEND_SERVER}/gates`, {})
              .then(res => {
                if (res.status === 200) {
                  this.setState({
                    ...this.state,
                    gates: res.data.message.sort((a, b) => (a.gate < b.gate ? -1 : 1))
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
    const { savedForm } = this.state

    this.setState({
      ...this.state,
      hasError: {
        ...this.state.hasError,
        groupRequired: false
      }
    }, () => {
      const { gate, group } = savedForm

      if (gate === '' || group === '') {
        this.setState({
          ...this.state,
          hasError: {
            gateRequired: gate === '',
            groupRequired: group === ''
          }
        })
      } else {
        callback()
      }
    })
  }

  handleAddClick = () => {
    this.setState({
      ...this.state,
      savedForm: {
        id: 0,
        group: '',
        gate: '',
      },
      dialog: {
        isActive: true,
        key: 'add'
      }
    })
  }

  handleAddSubmit = () => {
    this.checkErrorRequired(() => {
      const { savedForm } = this.state
    
      axios.post(`${BACKEND_SERVER}/groups`, { ...savedForm })
        .then(res => {
          if (res.status === 200) {
            window.location.reload()
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
    })
  }

  handleDeleteClick = (groupId) => {
    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        id: groupId,
        group: '',
        gate: ''
      },
      dialog: {
        isActive: true,
        key: 'delete'
      }
    })
  }

  handleDeleteSubmit = () => {
    const { savedForm } = this.state
    axios.delete(`${BACKEND_SERVER}/groups/${savedForm.id}`, {})
      .then(res => {
        if (res.status === 200) {
          window.location.reload()
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

  handleDialogClose = () => {
    this.setState({
      ...this.state,
      dialog: {
        ...this.state.dialog,
        isActive: false
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

  renderFormDialog = () => {
    const { classes } = this.props
    const {
      gates,
      hasError,
      savedForm
    } = this.state

    return (
      <Dialog
          open={true}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Group</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="group"
              name="group"
              label="Group Name"
              type="text"
              fullWidth
              onChange={this.handleOnChange}
            />
            {hasError.groupRequired && <FormHelperText>Required</FormHelperText>}
            <form className={classes.form} onSubmit={this.handleOnSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="gate">Gate</InputLabel>
                <Select
                  value={savedForm.gate}
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
                    gates.map(gate => <MenuItem key={gate.id} value={gate.gate}>{gate.gate}</MenuItem>)
                  }
                </Select>
                {hasError.gateRequired && <FormHelperText>Required</FormHelperText>}
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
    const { savedForm } = this.state

    return (
      <Dialog
          open={true}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Delete Group?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Group with id '{savedForm.id}' will be deleted. Are you sure?
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

  renderDialog = () => {
    const { key } = this.state.dialog

    switch (key) {
      case 'add':
        return this.renderFormDialog()
      case 'delete':
        return this.renderDeleteDialog()
      default:
        return <div></div>
    }
  }

  renderRedirect = () => {
    return false ||
      (!cookies.get('nrp') && <Redirect push to="/login" />) ||
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
    const { groups } = this.state

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
              Group List
            </Typography>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">Group</TableCell>
                  <TableCell align="left">Gate</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map(group => (
                  <TableRow key={group.id}>
                    <TableCell component="th" scope="row">
                      {group.id}
                    </TableCell>
                    <TableCell align="left">{group.group_name}</TableCell>
                    <TableCell align="left">{group.gate_id}</TableCell>
                    <TableCell align="left">
                      <DeleteIcon onClick={() => this.handleDeleteClick(group.id)} />
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
        {this.state.dialog.isActive && this.renderDialog()}
      </Fragment>
    )
  }
}

export default withStyles(AdminViewGroupsStyledComponent)(AdminViewGroups)
