import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import PeopleIcon from "@material-ui/icons/People";
import Button from "../../components/CustomButtons/Button.jsx";
import Snackbar from "../../components/Snackbar/Snackbar.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";

import { db } from "../../firebase";
import Dialogs from './Dialogs';

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

const columnData = [
  { id: 'name', numeric: false, sort: true, label: 'Cliente' },
  { id: 'id', numeric: false, sort: true, label: 'Identificación' },
  { id: 'address', numeric: false, sort: true, label: 'Dirección' },
  { id: 'phone', numeric: false, sort: true, label: 'Telefono' },
  { id: 'options', numeric: false, sort: false, label: 'Opciones' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                sortDirection={orderBy === column.id ? order : false}
              >{column.sort ?
                <Tooltip
                  title="Ordenar"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
                : column.label}
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  cardTitle: {
    marginBottom: "0",
    paddingTop: "10px",
    color: "#3C4858",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  cardTitleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '15px',
  }
});

class Clients extends React.Component {
  state = {
    clients: [],
    openDialogModify: false,
    add: false,
    id: null,
    order: 'asc',
    orderBy: 'name',
    page: 0,
    rowsPerPage: 10,
    message: "",
    tc: false
  };
  componentDidMount = () => {
    db.collection("clients")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          let pro = doc.data()
          pro.key = doc.id
          const index = this.state.clients.findIndex(p => p.key === doc.id)
          if (index >= 0) {
            this.setState(state => {
              state.clients[index] = pro
              return state
            })
          } else {
            this.setState(state => {
              state.clients.push(pro)
              return state
            })
          }
        });
      });
  }
  componentWillUnmount = () => {
    const unsubscribe = db.collection("clients")
      .onSnapshot(function () { });
    unsubscribe();
  }
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handlerButtonModify = element => {
    this.setState({
      id: element && element.key,
      openDialogModify: true,
      add: element ? false : true
    })
    setTimeout(() => {
      document.getElementById('name').value = element ? element.name : ""
      document.getElementById('id').value = element ? element.id : ""
      document.getElementById('address').value = element ? element.address : ""
      document.getElementById('phone').value = element ? element.phone : ""
    }, 1);
  }

  handlerModify = () => {
    db.collection("clients").doc(this.state.id).set({
      name: document.getElementById('name').value,
      id: document.getElementById('id').value,
      address: document.getElementById('address').value,
      phone: document.getElementById('phone').value,
    }, { merge: true })
      .then(() => {
        this.setState({ openDialogModify: false })
        console.log("Document successfully written!");
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  }

  handlerAddClient = () => {
    const name = document.getElementById('name').value
    const id = document.getElementById('id').value
    const address = document.getElementById('address').value
    const phone = document.getElementById('phone').value
    if (name.trim() && id.trim() && address.trim() && phone.trim()) {
      db.collection("clients").add({
        name,
        id,
        address,
        phone,
      })
        .then(docRef => {
          this.setState({ openDialogModify: false })
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    } else {
      this.setState({
        message: "Llenar todos los campos",
        tc: true
      })
      setTimeout(() => {
        this.setState({ tc: false })
      }, 5000);
    }
  }
  render() {
    const { classes } = this.props;
    const { order, orderBy, rowsPerPage, page, clients } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, Object.keys(clients).length - page * rowsPerPage);
    return (
      <Paper className={classes.root}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <PeopleIcon />
            </CardIcon>
            <div className={classes.cardTitleWrapper} >
              <h4 className={classes.cardTitle}>Clientes</h4>
              <Tooltip title="Agregar cliente">
                <IconButton
                  onClick={() => this.handlerButtonModify()}
                  aria-label="Agregar cliente">
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </div>
          </CardHeader>
          <CardBody>
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {clients
                    .sort(getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => {
                      return (
                        <TableRow
                          tabIndex={-1}
                          key={n.key}
                        >
                          <TableCell component="th" scope="row">
                            {n.name}
                          </TableCell>
                          <TableCell>{n.id}</TableCell>
                          <TableCell>{n.address}</TableCell>
                          <TableCell>{n.phone}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => this.handlerButtonModify(n)} color="primary" round>Modificar</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              component="div"
              count={Object.keys(clients).length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              labelRowsPerPage="Filas por pagina"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
            <Dialogs
              openDialogModify={this.state.openDialogModify}
              onCloseModify={() => this.setState({ openDialogModify: false })}
              handlerModify={() => this.handlerModify()}
              handlerAddClient={() => this.handlerAddClient()}
              add={this.state.add}
            />
            <Snackbar
              place="tc"
              color="danger"
              icon={ErrorIcon}
              message={this.state.message}
              open={this.state.tc}
              closeNotification={() => this.setState({ tc: false })}
              close
            />
          </CardBody>
        </Card>
      </Paper>
    );
  }
}

Clients.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Clients);