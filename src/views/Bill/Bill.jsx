import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import Grid from "@material-ui/core/Grid";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import 'react-select/dist/react-select.css';

import { billStyles } from "./Styles";

class Option extends React.Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props;

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {children}
      </MenuItem>
    );
  }
}

function SelectWrapped(props) {
  const { classes, ...other } = props;

  return (
    <Select
      optionComponent={Option}
      noResultsText={<Typography>{'No results found'}</Typography>}
      arrowRenderer={arrowProps => {
        return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
      }}
      clearRenderer={() => <ClearIcon />}
      valueComponent={valueProps => {
        const { value, children, onRemove } = valueProps;

        const onDelete = event => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        };

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          );
        }

        return <div className="Select-value">{children}</div>;
      }}
      {...other}
    />
  );
}

class Bill extends React.Component {
  state = {
    cli: null,
    dateBill: moment().toISOString().slice(0, 10),
    optionClient: []
  };
  componentDidMount = () => {
    console.log(this.props.clients);
    this.setState({
      optionClient: this.props.clients.map(suggestion => ({
        value: suggestion.key,
        label: suggestion.name,
      }))
    })
  }
  handleChangeAutocomplet = name => value => {
    this.setState({
      [name]: value,
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { classes } = this.props;
    const { optionClient } = this.state

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              fullWidth
              value={this.state.cli}
              onChange={this.handleChangeAutocomplet('cli')}
              placeholder="Seleccione el cliente"
              name="react-select-cli"
              label="Cliente"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputComponent: SelectWrapped,
                inputProps: {
                  classes,
                  instanceId: 'react-select-cli',
                  id: 'react-select-cli',
                  simpleValue: true,
                  options: optionClient,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              fullWidth
              name="dateBill"
              label="Fecha de Factura"
              type="date"
              className={classes.textField}
              value={this.state.dateBill}
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell numeric>Cantidad</TableCell>
                  <TableCell numeric>Precio Unitario</TableCell>
                  <TableCell numeric>Precio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {data.map(n => {
              return (
                <TableRow className={classes.row} key={n.id}>
                  <TableCell component="th" scope="row">
                    {n.name}
                  </TableCell>
                  <TableCell numeric>{n.calories}</TableCell>
                  <TableCell numeric>{n.fat}</TableCell>
                  <TableCell numeric>{n.carbs}</TableCell>
                  <TableCell numeric>{n.protein}</TableCell>
                </TableRow>
              );
            })} */}
                <TableRow>
                  <TableCell>
                    <Button size="small" color="primary" className={classes.buttonAdd}>Añadir un elemento</Button>
                  </TableCell>
                  <TableCell numeric></TableCell>
                  <TableCell numeric></TableCell>
                  <TableCell numeric></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Bill.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(billStyles)(Bill);