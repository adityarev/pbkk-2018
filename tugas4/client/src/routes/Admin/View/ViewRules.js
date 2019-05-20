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
import AdminViewRulesStyledComponent from '../../../styledComponents/adminViewRules'
import SnackbarPopUp from '../../../components/Snackbar/SnackbarPopUp'

const cookies = new Cookies()

class AdminViewRules extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      gates: [],
      groups:[],
      rules: [],
      redirect: {
        isActive: false,
        link: ''
      },
      dialog: {
        isActive: false,
        key: ''
      },
      hasError: {
        gateIdRequired: false,
        groupIdRequired: false,
      },
      savedForm: {
        ruleId: '',
        open: '',
        close: '',
        gateId: '',
        groupId: ''
      },
      snackbar: {
        isActive: false,
        message: '',
        variant: ''
      },
    }
  }

  componentDidMount() {
    axios.get(`${BACKEND_SERVER}/rules`, {})
      .then(res => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            rules: res.data.result.sort((a, b) => (a.id < b.id ? -1 : 1))
          }, () => {
            axios.get(`${BACKEND_SERVER}/groups`, {})
              .then(res => {
                if (res.status === 200) {
                  this.setState({
                    ...this.state,
                    groups: res.data.result.sort((a, b) => (a.id < b.id ? -1 : 1))
                  }, () => {
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
                          this.handleRequestFailed('Can\'t fetch gates from server!')
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
          this.handleRequestFailed('Can\'t fetch rules from server!')
        } else {
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
  }

  checkErrorRequired = (callback) => {
    const { groupId, gateId } = this.state.savedForm

    this.setState({
      ...this.state,
      hasError: {
        groupIdRequired: false,
        gateIdRequired: false
      }
    }, () => {
      if (groupId === '0' || gateId === '0') {
        this.setState({
          ...this.state,
          hasError: {
            groupIdRequired: groupId === '0',
            gateIdRequired: gateId === '0'
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
        ...this.state.savedForm,
        open: '0',
        close: '0',
        gateId: '0',
        groupId: '0'
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
      axios.post(`${BACKEND_SERVER}/rules`, { ...savedForm })
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
  }

  handleEditClick = (ruleId) => {
    const { rules } = this.state
    const rule = rules.find(rule => rule.id === ruleId)

    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        ruleId: ruleId.toString(10),
        open: rule.open,
        close: rule.close,
        gateId: rule.gateId,
        groupId: rule.groupId
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

  handleDeleteClick = (ruleId) => {
    this.setState({
      ...this.state,
      savedForm: {
        ...this.state.savedForm,
        ruleId: ruleId.toString(10)
      },
      dialog: {
        isActive: true,
        key: 'delete'
      }
    })
  }

  handleDeleteSubmit = () => {
    const { savedForm } = this.state

    axios.delete(`${BACKEND_SERVER}/rules/${savedForm.ruleId}`, {})
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
        [name]: (name === 'open' || name === 'close') ? parseInt(value.slice(0, 2), 10).toString(10) : value
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
      groups,
      gates,
      savedForm
    } = this.state
    const { key } = this.state.dialog

    return (
      <Dialog
        open={true}
        onClose={this.handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {key === 'add' ? 'Add New Rule' : 'Edit Rule'}
        </DialogTitle>
        <DialogContent>
          <form className={classes.container} noValidate>
            <TextField
              id="open"
              name="open"
              label="Open Time"
              type="time"
              defaultValue={("0" + savedForm.open).slice(-2) + ":00"}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 3600, // 1 hour
              }}
              onChange={this.handleOnChange}
            />
            <TextField
              id="close"
              name="close"
              label="Close Time"
              type="time"
              defaultValue={("0" + savedForm.close).slice(-2) + ":00"}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 3600, // 1 hour
              }}
              onChange={this.handleOnChange}
            />
          </form>
          <form className={classes.form} onSubmit={this.handleOnSubmit}>
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
                  groups.map(group => <MenuItem key={group.id} value={group.id.toString(10)}>{group.name}</MenuItem>)
                }
              </Select>
              {this.state.hasError.groupIdRequired && <FormHelperText>Required</FormHelperText>}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="gateId">Gate</InputLabel>
              <Select
                value={savedForm.gateId}
                onChange={this.handleOnChange}
                name="gateId"
                inputProps={{
                  id: 'gateId',
                }}
                className={classes.selectEmpty}
              >
                <MenuItem value={'0'}>
                  <em>None</em>
                </MenuItem>
                {
                  gates.map(gate => <MenuItem key={gate.id} value={gate.id.toString(10)}>{gate.name}</MenuItem>)
                }
              </Select>
              {this.state.hasError.gateIdRequired && <FormHelperText>Required</FormHelperText>}
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDialogClose} color="primary">
            Cancel
          </Button>
          {
            key === 'add' ?
              <Button onClick={this.handleAddSubmit} color="primary">
                Add
              </Button> :
              <Button onClick={this.handleEditSubmit} color="primary" disabled>
                Save Changes
              </Button>
          }
        </DialogActions>
      </Dialog>
    )
  }

  renderConfirmationDialog = () => {
    const { savedForm } = this.state

    return (
      <Dialog
        open={true}
        onClose={this.handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Rule?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Rule #{savedForm.ruleId} will be deleted. Are you sure?
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
        return this.renderConfirmationDialog()
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
    const { rules, groups, gates } = this.state

    if (rules.length === 0 || groups.length === 0 || gates.length === 0) {
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
              Rule List
            </Typography>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">Open</TableCell>
                  <TableCell align="left">Close</TableCell>
                  <TableCell align="left">Gate</TableCell>
                  <TableCell align="left">Group</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell component="th" scope="row">
                      {rule.id}
                    </TableCell>
                    <TableCell align="left">{("0" + rule.open).slice(-2)}:00</TableCell>
                    <TableCell align="left">{("0" + rule.close).slice(-2)}:00</TableCell>
                    <TableCell align="left">{gates.find(gate => gate.id === rule.gateId).name}</TableCell>
                    <TableCell align="left">{groups.find(group => group.id === rule.groupId).name}</TableCell>
                    <TableCell align="left">
                      <EditIcon onClick={() => this.handleEditClick(rule.id)} />
                      <DeleteIcon onClick={() => this.handleDeleteClick(rule.id)} />
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

export default withStyles(AdminViewRulesStyledComponent)(AdminViewRules)
