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
import InfoIcon from '@material-ui/icons/Info'
import Paper from '@material-ui/core/Paper'
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
import AdminViewGatesStyledComponent from '../../../styledComponents/adminViewGates'
import SnackbarPopUp from '../../../components/Snackbar/SnackbarPopUp'

const cookies = new Cookies()

class AdminViewGates extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      gates: [],
      redirect: {
        isActive: false,
        link: ''
      },
      dialog: {
        isActive: false,
        key: ''
      },
      savedForm: {
        gateId: '',
        gateName: '',
      },
      snackbar: {
        isActive: false,
        message: "",
        variant: ""
      },
    }
  }

  componentDidMount() {
    axios.get(`${BACKEND_SERVER}/gates`, {})
      .then(res => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            gates: res.data.result.sort((a, b) => (a.id < b.id ? -1 : 1))
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

  handleAddClick = () => {
    this.setState({
      ...this.state,
      dialog: {
        isActive: true,
        key: 'add'
      }
    })
  }

  handleAddSubmit = () => {
    const { savedForm } = this.state
    axios.post(`${BACKEND_SERVER}/gates`, { name: savedForm.gateName })
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

  handleDeleteClick = (gateId) => {
    const { gates } = this.state

    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        gateId: gateId.toString(10),
        gateName: gates.find(gate => gate.id === gateId).name
      },
      dialog: {
        isActive: true,
        key: 'delete'
      }
    })
  }

  handleDeleteSubmit = () => {
    const { savedForm } = this.state
    axios.delete(`${BACKEND_SERVER}/gates/${savedForm.gateId}`, {})
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

  handleEditClick = (gateId) => {
    const { gates } = this.state

    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        gateId: gateId.toString(10),
        gateName: gates.find(gate => gate.id === gateId).name
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

  renderAddDialog = () => {
    return (
      <Dialog
          open={true}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Gate</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="gateName"
              name="gateName"
              label="Gate Name"
              type="text"
              fullWidth
              onChange={this.handleOnChange}
            />
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
    const { gateName } = this.state.savedForm

    return (
      <Dialog
          open={true}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Delete Gate?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Gate named '{gateName}' will be deleted. Are you sure?
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

  renderEditDialog = () => {
    return (
      <Dialog
          open={true}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Gate</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="gateName"
              name="gateName"
              label="Gate Name"
              type="text"
              fullWidth
              onChange={this.handleOnChange}
              value={this.state.savedForm.gateName}
            />
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

  renderDialog = () => {
    const { key } = this.state.dialog

    switch (key) {
      case 'add':
        return this.renderAddDialog()
      case 'edit':
        return this.renderEditDialog()
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
    const { gates } = this.state

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
              Gate List
            </Typography>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gates.map(gate => (
                  <TableRow key={gate.id}>
                    <TableCell component="th" scope="row">
                      {gate.id}
                    </TableCell>
                    <TableCell align="left">{gate.name}</TableCell>
                    <TableCell align="left">
                      <EditIcon onClick={() => this.handleEditClick(gate.id)} />
                      <DeleteIcon onClick={() => this.handleDeleteClick(gate.id)} />
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

export default withStyles(AdminViewGatesStyledComponent)(AdminViewGates)
