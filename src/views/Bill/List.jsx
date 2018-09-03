import React, { Component } from 'react'
import PropTypes from 'prop-types';
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
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
import Typography from '@material-ui/core/Typography';

import { listStyles } from "./Styles";
import { toDatePicker, formatCurrency } from "utils";

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
      <div className={classes.root1}>
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

const TablePaginationActionsWrapped = withStyles(listStyles, { withTheme: true })(
  TablePaginationActions,
);

let Filter = props => {
  const { classes, initialDate, finalDate, client, clients, handleChange } = props;
  let cli = []
  for (const key in clients) {
    if (clients.hasOwnProperty(key)) {
      const element = clients[key];
      cli.push(<MenuItem key={key} value={element.key}>{`${element.name} ${element.address}`}</MenuItem>)
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
              <FormHelperText>Clientes</FormHelperText>
              <Select
                value={client}
                onChange={handleChange}
                displayEmpty
                name='client'
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {cli}
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

Filter = withStyles(listStyles)(Filter);

class List extends Component {
  state = {
    page: 0,
    rowsPerPage: 10,
    initialDate: moment().hour(0).minute(0).second(0).subtract(1, 'month'),
    finalDate: moment().hour(23).minute(59).second(59),
    client: "",
    loading: false,
  };
  componentDidMount = () => {
    this.props.getBills(this.state)
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  nameClient = id => {
    const client = this.props.clients.find(c => id === c.key)
    return `${client.name} ${client.address}`
  }
  handleChange = async event => {
    try {
      if (event.target.name === "initialDate" || event.target.name === "finalDate") {
        this.setState({ loading: true })
        let date = moment(event.target.value)
        event.target.name === "initialDate"
          ? date.hour(0).minute(0).second(0)
          : date.hour(23).minute(59).second(59)
        const state = { [event.target.name]: date }
        await this.setState({
          ...state,
          // loading: false
        });
        await this.props.getBills(this.state)
      } else {
        this.setState({ [event.target.name]: event.target.value });
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  render() {
    const { classes, openBill, clients } = this.props;
    let { bills } = this.props
    let { rowsPerPage, page, initialDate, finalDate, client } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, bills.length - page * rowsPerPage);
    bills = bills
      .filter(b => client === "" ? true : b.client === client)
      .sort((a, b) => a.date < b.date ? 1 : -1)
    return (
      <div className={classes.tableWrapper}>
        <Filter
          initialDate={initialDate}
          finalDate={finalDate}
          client={client}
          handleChange={this.handleChange}
          clients={clients}
        />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha Factura</TableCell>
              <TableCell numeric>Número Factura</TableCell>
              <TableCell numeric>Total</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(n => {

                return (
                  <TableRow
                    hover
                    onClick={() => openBill(n)}
                    className={classes.row}
                    key={n.key}
                  >
                    <TableCell component="th" scope="row">
                      {clients.length > 0 && n.client
                        ? this.nameClient(n.client)
                        : ""
                      }
                    </TableCell>
                    <TableCell>{toDatePicker(n.date.toDate())}</TableCell>
                    <TableCell numeric>{n.number}</TableCell>
                    <TableCell numeric>{formatCurrency(n.amountTotal)}</TableCell>
                    <TableCell>
                      {n.valid
                        ? <Typography variant="body2" color="textSecondary" gutterBottom>Validada</Typography>
                        : <Typography variant="body2" color="error" gutterBottom>Borrador</Typography>
                      }
                    </TableCell>
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
                count={bills.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActionsWrapped}
                labelRowsPerPage="Filas por pagina"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                rowsPerPageOptions={[10, 25, 50]}
              />
              <TableCell colSpan={2} numeric>
                <Typography variant="title" gutterBottom>
                  {`Total: ${formatCurrency(bills.reduce((a, b) => a + b.amountTotal, 0))}`}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}

List.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(listStyles)(List)
