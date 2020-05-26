import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import LoopIcon from "@material-ui/icons/Loop";
import CardIcon from "../../components/Card/CardIcon.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";

import { db } from "../../firebase";
import { toDatePicker } from "../../utils";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

const filterStyles = theme => ({
  containerFilter: {
    marginTop: 10,
    marginBottom: 10,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  formControl: {
    minWidth: 120,
    marginTop: -2,
  },
})

let Filter = props => {
  const { classes, initialDate, finalDate, product, products, handleChange } = props;
  let pro = []
  for (const key in products) {
    if (products.hasOwnProperty(key)) {
      const element = products[key];
      pro.push(<MenuItem key={key} value={key}>{element.name}</MenuItem>)
    }
  }
  return (
    <Grid container spacing={16}>
      <Grid item xs={12}>
        <Grid container className={classes.containerFilter} justify="center" spacing={40}>
          <Grid item>
            <TextField
              name="initialDate"
              label="Fecha Inicial"
              type="date"
              className={classes.textField}
              value={toDatePicker(initialDate.toDate())}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              name="finalDate"
              label="Fecha Final"
              type="date"
              className={classes.textField}
              value={toDatePicker(finalDate.toDate())}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item>
            <FormControl className={classes.formControl}>
              <FormHelperText>Productos</FormHelperText>
              <Select
                value={product}
                onChange={handleChange}
                displayEmpty
                name='product'
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {pro}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

Filter.propTypes = {
  classes: PropTypes.object.isRequired,
};

Filter = withStyles(filterStyles)(Filter);

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  // table: {
  //   minWidth: 500,
  // },
  tableWrapper: {
    overflowX: document.documentElement.clientWidth > 1170 ? 'none' : 'auto',
  },
  cardCategory: {
    color: "#999999",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "3px",
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
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: "100vh",
  },
  row: {
    height: 'auto'
  }
});

class Moves extends React.Component {
  state = {
    data: [],
    page: 0,
    rowsPerPage: 10,
    initialDate: moment().hour(0).minute(0).second(0).subtract(1, 'month'),
    finalDate: moment().hour(23).minute(59).second(59),
    products: [],
    product: "",
    loading: false,
  };

  componentDidMount = async () => {
    const data = await this.searchMovements(this.state)
    this.setState({ data })
    this.searchProducts()
  }

  searchProducts = () => {
    db.collection("products")
      .get()
      .then(querySnapshot => {
        let products = []
        querySnapshot.forEach(doc => {
          products[doc.id] = doc.data()
        });
        this.setState({ products })
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
  }

  searchMovements = async ({ initialDate, finalDate }) => {
    const querySnapshot = await db.collection("productsMov")
      .where("date", ">", initialDate.toDate())
      .where("date", "<", finalDate.toDate())
      .get()
    let data = []
    querySnapshot.forEach(item => {
      let mov = item.data();
      mov.key = item.id;
      data.push(mov)
    });
    return data
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  handleChange = async event => {
    try {
      if (event.target.name === "initialDate" || event.target.name === "finalDate") {
        this.setState({ loading: true })
        let date = moment(event.target.value)
        event.target.name === "initialDate"
          ? date.hour(0).minute(0).second(0)
          : date.hour(23).minute(59).second(59)
        const state = { [event.target.name]: date }
        const data = await this.searchMovements({ ...this.state, ...state })
        this.setState({
          ...state,
          data,
          loading: false
        });
      } else {
        this.setState({ [event.target.name]: event.target.value });
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  render() {
    const { classes } = this.props;
    let { data, rowsPerPage, page, initialDate, finalDate, product, products, loading } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    if (loading) {
      return <div className={classes.progress}>
        <CircularProgress />
      </div>
    }
    data = data
      .filter(d => product === "" ? true : d.id === product)
      .sort((a, b) => a.date < b.date ? 1 : -1)
    return (
      <Paper className={classes.root}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <LoopIcon />
            </CardIcon>
            <h4 className={classes.cardTitle}>Movimientos</h4>
            <p className={classes.cardCategory}>
              Seleccione los filtros para mejorar la busqueda de movimientos en los productos
            </p>
          </CardHeader>
          <CardBody>
            <div className={classes.tableWrapper}>
              <Filter
                initialDate={initialDate}
                finalDate={finalDate}
                product={product}
                handleChange={this.handleChange}
                products={products}
              />
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell numeric>Agrego</TableCell>
                    <TableCell numeric>Total</TableCell>
                    <TableCell>Observaciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => {
                      return (
                        <TableRow className={classes.row} key={n.key}>
                          <TableCell component="th" scope="row">{n.date.toDate().toLocaleString()}</TableCell>
                          <TableCell>{products[n.id] ? products[n.id].name : ""}</TableCell>
                          <TableCell numeric>{n.quantity}</TableCell>
                          <TableCell numeric>{n.total}</TableCell>
                          <TableCell>{n.note}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 48 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      colSpan={3}
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActionsWrapped}
                      labelRowsPerPage="Filas por pagina"
                      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                      rowsPerPageOptions={[10, 25, 50]}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Paper>
    );
  }
}

Moves.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Moves);