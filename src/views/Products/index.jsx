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
import ViewList from "@material-ui/icons/ViewList";
import Button from "../../components/CustomButtons/Button.jsx";
import Snackbar from "../../components/Snackbar/Snackbar.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";

import { db } from "../../firebase";
import { formatCurrency } from "../../utils";
import Dialogs from './Dialogs';

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

const columnData = [
  { id: 'name', numeric: false, sort: true, label: 'Nombre' },
  { id: 'total', numeric: true, sort: true, label: 'Cantidad' },
  { id: 'amount', numeric: true, sort: true, label: 'Valor Unidad($)' },
  { id: 'options', numeric: true, sort: false, label: 'Opciones' },
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

class Products extends React.Component {
  state = {
    products: [],
    openDialogAdd: false,
    openDialogModify: false,
    add: false,
    id: null,
    order: 'asc',
    orderBy: 'name',
    page: 0,
    rowsPerPage: 10,
    message: "",
    tc: false,
    force: false,
  };
  componentDidMount = () => {
    db.collection("products")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          let pro = doc.data()
          pro.id = doc.id
          const index = this.state.products.findIndex(p => p.id === doc.id)
          if (index >= 0) {
            this.setState(state => {
              state.products[index] = pro
              return state
            })
          } else {
            this.setState(state => {
              state.products.push(pro)
              return state
            })
          }
        });
      });
  }
  componentWillUnmount = () => {
    const unsubscribe = db.collection("products")
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

  handlerButtonAdd = (id, force) => {
    console.log(id, force)
    this.setState({
      id,
      openDialogAdd: true,
      force: force ? true : false,
    })
  }

  handlerAdd = e => {
    const button = document.getElementById('button-add')
    button.style.pointerEvents = 'none'
    const quantity = document.getElementById("quantity")
    if (quantity.value >= 0) {
      // Create a reference to the SF doc.
      const sfDocRef = db.collection("products").doc(this.state.id);

      return db.runTransaction(transaction => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(sfDocRef).then(sfDoc => {
          if (!sfDoc.exists) {
            throw new Error("Document does not exist!");
          }
          const newTotal = this.state.force
            ? parseFloat(quantity.value)
            : sfDoc.data().total + parseFloat(quantity.value);
          db.collection("productsMov").add({
            date: new Date(),
            id: this.state.id,
            quantity: quantity.value,
            total: newTotal,
            note: this.state.force ? "Ajuste de producto" : "",
          })
          transaction.update(sfDocRef, { total: newTotal });
        });
      }).then(() => {
        this.setState({
          openDialogAdd: false,
        })
        console.log("Transaction successfully committed!");
      }).catch(error => {
        this.setState({
          message: error,
          tc: true
        })
        setTimeout(() => {
          this.setState({ tc: false })
        }, 5000);
        console.log("Transaction failed: ", error);
      });
    }
  }

  handlerButtonModify = element => {
    this.setState({
      id: element && element.id,
      openDialogModify: true,
      add: element ? false : true
    })
    setTimeout(() => {
      document.getElementById('name').value = element ? element.name : ""
      document.getElementById('amount').value = element ? element.amount : ""
    }, 1);
  }

  handlerModify = () => {
    db.collection("products").doc(this.state.id).set({
      name: document.getElementById('name').value,
      amount: parseFloat(document.getElementById('amount').value),
    }, { merge: true })
      .then(() => {
        this.setState({ openDialogModify: false })
        console.log("Document successfully written!");
      })
      .catch(error => {
        this.setState({
          message: error,
          tc: true
        })
        setTimeout(() => {
          this.setState({ tc: false })
        }, 5000);
        console.error("Error writing document: ", error);
      });
  }

  handlerAddProduct = () => {
    const button = document.getElementById('button-form')
    button.style.pointerEvents = 'none'
    const name = document.getElementById('name').value
    const amount = document.getElementById('amount').value
    if (name.trim() && amount) {
      db.collection("products").add({
        name,
        amount,
        total: 0,
      })
        .then(docRef => {
          this.setState({ openDialogModify: false })
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(error => {
          this.setState({
            message: error,
            tc: true
          })
          setTimeout(() => {
            this.setState({ tc: false })
          }, 5000);
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
    const { order, orderBy, rowsPerPage, page, products } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, Object.keys(products).length - page * rowsPerPage);
    return (
      <Paper className={classes.root}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <ViewList />
            </CardIcon>
            <div className={classes.cardTitleWrapper} >
              <h4 className={classes.cardTitle}>Productos</h4>
              <Tooltip title="Agregar producto">
                <IconButton
                  onClick={() => this.handlerButtonModify()}
                  aria-label="Agregar producto">
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
                  {products
                    .sort(getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => {
                      return (
                        <TableRow
                          tabIndex={-1}
                          key={n.id}
                        >
                          <TableCell component="th" scope="row">
                            {n.name}
                          </TableCell>
                          <TableCell numeric>{n.total}</TableCell>
                          <TableCell numeric>{formatCurrency(n.amount)}</TableCell>
                          <TableCell numeric>
                            <Button onClick={() => this.handlerButtonAdd(n.id)} size="sm" color="primary" round>Agregar</Button>
                            <Button onClick={() => this.handlerButtonModify(n)} size="sm" round>Modificar</Button>
                            <Button onClick={() => this.handlerButtonAdd(n.id, true)} size="sm" round>Forzar</Button>
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
              count={Object.keys(products).length}
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
              openDialogAdd={this.state.openDialogAdd}
              onCloseAdd={() => this.setState({ openDialogAdd: false })}
              handlerAdd={() => this.handlerAdd()}
              openDialogModify={this.state.openDialogModify}
              onCloseModify={() => this.setState({ openDialogModify: false })}
              handlerModify={() => this.handlerModify()}
              handlerAddProduct={() => this.handlerAddProduct()}
              add={this.state.add}
              force={this.state.force}
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

Products.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Products);