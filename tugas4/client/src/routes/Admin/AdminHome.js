import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Paper from '@material-ui/core/Paper'
import SupervisorAccountRounded from '@material-ui/icons/SupervisorAccountRounded'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'
import AdminHomeStyledComponent from '../../styledComponents/adminHome'

const cookies = new Cookies()

class AdminHome extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      redirect: {
        isActive: false,
        link: '',
      },
      tileData: [
        {
          img: 'https://cdn1.iconfinder.com/data/icons/door-3/200/1338-512.png',
          link: '/admin/gates',
          title: 'View Gates'
        },
        {
          img: 'https://image.flaticon.com/icons/png/512/33/33308.png',
          link: '/admin/users',
          title: 'View Users'
        },
        {
          img: 'https://image.flaticon.com/icons/png/512/32/32441.png',
          link: '/admin/groups',
          title: 'View Groups'
        }
      ]
    }
  }

  handleLogout = (event) => {
    this.setState({
      ...this.state,
      redirect: {
        isActive: true,
        link: '/login'
      }
    }, () => {
      cookies.remove('username')
    })
  }

  handleEnterGate = (gate) => {
    this.setState({
      ...this.state,
      redirect: {
        isActive: true,
        link: gate
      }
    })
  }

  renderRedirect() {
    return false ||
      (!cookies.get('username') && <Redirect push to='/login' />) ||
      (this.state.redirect.isActive && <Redirect push to={this.state.redirect.link} />)
  }
  
  render() {
    const { classes } = this.props
    const { tileData } = this.state

    return (
      this.renderRedirect() ||
      <Fragment>
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <SupervisorAccountRounded />
            </Avatar>
            <Typography component="h1" variant="h5">
              Welcome, {cookies.get('username')}!
            </Typography>
            <div className={classes.root}>
              <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                  <ListSubheader component="div">Menu</ListSubheader>
                </GridListTile>
                {tileData.map(tile => (
                  <GridListTile key={tile.img}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                      title={tile.title}
                      actionIcon={
                        <IconButton className={classes.icon} onClick={() => this.handleEnterGate(tile.link)}>
                          <InfoIcon />
                        </IconButton>
                      }
                    />
                  </GridListTile>
                ))}
              </GridList>
            </div>
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

export default withStyles(AdminHomeStyledComponent)(AdminHome)
