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
import { formTimeFormat, pickerTimeFormat, tableTimeFormat } from '../../../util/formatter'
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
        id: '',
        gate: '',
        open: '',
        close: '',
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
            gates: res.data.message.sort((a, b) => (a.id < b.id ? -1 : 1))
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
      savedForm: {
        id: '',
        gate: '',
        open: '2019-01-01 00:00',
        close: '2019-01-01 00:00',
      },
      dialog: {
        isActive: true,
        key: 'add'
      }
    })
  }

  handleAddSubmit = () => {
    const { savedForm } = this.state

    axios.post(`${BACKEND_SERVER}/gates`, { ...savedForm })
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

  handleDeleteClick = (id) => {
    const { gates } = this.state
    const gate = gates.find(gate => gate.id === id)
    
    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        gate: gate.gate
      },
      dialog: {
        isActive: true,
        key: 'delete'
      }
    })
  }

  handleDeleteSubmit = () => {
    const { savedForm } = this.state

    axios.delete(`${BACKEND_SERVER}/gates/${savedForm.gate}`, {})
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

  handleEditClick = (id) => {
    const { gates } = this.state
    const gate = gates.find(gate => gate.id === id)

    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        id: id,
        gate: gate.gate,
        open: formTimeFormat(gate.open),
        close: formTimeFormat(gate.close),
      },
      dialog: {
        isActive: true,
        key: 'edit'
      }
    })
  }

  handleEditSubmit = () => {
    const { savedForm } = this.state

    axios.put(`${BACKEND_SERVER}/gates`, { ...savedForm })
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
      savedForm: {
        id: '',
        gate: '',
        open: '2019-01-01 00:00',
        close: '2019-01-01 00:00',
      },
      dialog: {
        isActive: false,
        key: ''
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
    console.log(value)

    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        [name]: (name === 'open' || name === 'close') ? formTimeFormat(value) : value
      }
    }, () => {
      console.log(this.state.savedForm)
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
    const { savedForm, dialog } = this.state

    return (
      <Dialog
          open={true}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {dialog.key === 'add' ? 'Add New Gate' : 'Edit Gate'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="gate"
              name="gate"
              label="Gate"
              type="text"
              fullWidth
              onChange={this.handleOnChange}
              value={savedForm.gate}
              disabled={dialog.key !== 'add'}
            />
            <form className={classes.container} noValidate>
              <TextField
                id="open"
                name="open"
                label="Open"
                type="datetime-local"
                defaultValue={pickerTimeFormat(savedForm.open)}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={this.handleOnChange}
              />
              <TextField
                id="close"
                name="close"
                label="Close"
                type="datetime-local"
                defaultValue={pickerTimeFormat(savedForm.close)}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={this.handleOnChange}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            {
              dialog.key === 'add' ?
                <Button onClick={this.handleAddSubmit} color="primary">
                  Add
                </Button> :
                <Button onClick={this.handleEditSubmit} color="primary">
                  Save Changes
                </Button>
            }
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
          <DialogTitle id="form-dialog-title">Delete Gate?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Gate '{savedForm.gate}' will be deleted. Are you sure?
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
      case 'edit':
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
                  <TableCell align="left">Gate</TableCell>
                  <TableCell align="left">Open</TableCell>
                  <TableCell align="left">Close</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gates.map(gate => (
                  <TableRow key={gate.id}>
                    <TableCell component="th" scope="row">
                      {gate.id}
                    </TableCell>
                    <TableCell align="left">{gate.gate}</TableCell>
                    <TableCell align="left">{tableTimeFormat(gate.open)}</TableCell>
                    <TableCell align="left">{tableTimeFormat(gate.close)}</TableCell>
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
