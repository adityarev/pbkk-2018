const AdminViewGatesStyledComponent = theme => ({
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  fab: {
    margin: theme.spacing.unit,
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 700,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  table: {},
  textField: {
    width: '100%',
  },
})

export default AdminViewGatesStyledComponent
