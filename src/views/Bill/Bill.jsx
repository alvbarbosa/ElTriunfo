import React from 'react';
import PropTypes from 'prop-types';
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
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import TableFooter from '@material-ui/core/TableFooter';
import 'react-select/dist/react-select.css';
import { billStyles } from "./Styles";
import { db } from "../../firebase";
import { formatCurrency, toDatePicker } from "utils";
import Dialogs from './Dialogs'

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
    client: null,
    product: null,
    dateBill: toDatePicker(new Date()),
    optionClient: [],
    optionProduct: [],
    openDialogItem: false,
    add: true,
    unitPrice: 0,
    quantity: 0,
    price: 0,
    idItem: "",
    amountTotal: 0,
    valid: false,
    number: 0
  };
  componentDidMount = () => {
    const { bill } = this.props
    this.setState({
      dateBill: toDatePicker(bill.date.toDate()),
      client: bill.client,
      valid: bill.valid,
      optionClient: this.props.clients.map(suggestion => ({
        value: suggestion.key,
        label: suggestion.name,
      })),
      optionProduct: this.props.products.map(suggestion => ({
        value: suggestion.key,
        label: suggestion.name,
      })),
    })
  }

  handleChangeAutocomplet = name => async value => {
    let unitPrice = 0
    if (name === "product") {
      unitPrice = value ? this.props.products.find(p => p.key === value).amount : 0
      this.setState({
        unitPrice,
        price: unitPrice * this.state.quantity,
        [name]: value,
      });
    } else {
      await this.setState({ [name]: value })
      this.saveBill()
    }
  };

  handleChange = async event => {
    const { name, value } = event.target
    await this.setState((state, props) => {
      let nextState = {
        ...state,
        [name]: value
      }
      nextState.price = nextState.unitPrice * nextState.quantity
      return nextState
    })
    if (name === "dateBill") {
      this.saveBill()
    }
  }

  handleopenDialogItem = element => {
    this.setState({
      idItem: element ? element.key : "",
      product: element ? element.product : null,
      quantity: element ? element.quantity : 0,
      unitPrice: element ? element.unitPrice : 0,
      price: element ? (element.unitPrice * element.quantity) : 0,
      openDialogItem: true,
      add: element ? false : true,
    })
  }

  handleButtomDelete = key => {
    db.collection("bills").doc(this.props.bill.key).collection('items').doc(key)
      .delete().then(() => {
        this.forceUpdate()
        console.log("Document successfully deleted!");
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }

  handlerAddItem = e => {
    e.preventDefault()
    const { quantity, unitPrice, price, product } = this.state
    const { bill, showError } = this.props
    if (product && quantity && unitPrice) {
      db.collection('bills').doc(bill.key).collection('items').add({
        product,
        quantity,
        unitPrice,
        price
      }).then(docRef => {
        this.setState({ openDialogItem: false })
        console.log("Document written with ID: ", docRef.id);
      }).catch(error => {
        console.error("Error adding document: ", error);
      });
    } else {
      showError("Llenar todos los campos")
    }
  }

  handlerModifyItem = e => {
    e.preventDefault()
    const { quantity, unitPrice, bill, price, product, idItem } = this.state
    if (product && quantity && unitPrice) {
      db.collection('bills').doc(bill.key).collection('items').doc(idItem).set({
        product,
        price,
        unitPrice,
        quantity,
      }, { merge: true }).then(() => {
        this.setState({ openDialogItem: false })
        console.log("Document successfully written!");
      })
        .catch(error => {
          console.error("Error writing document: ", error);
        });
    }
  }

  saveBill = () => {
    const { bill } = this.props
    const { client, dateBill, valid, amountTotal, number } = this.state
    db.collection('bills').doc(bill.key).set({
      client,
      valid,
      amountTotal,
      date: new Date(dateBill.substring(0, 4), dateBill.substring(5, 7) - 1, dateBill.substring(8, 10)),
      number,
    }, { merge: true }).then(() => {
      console.log("Document successfully written!");
    }).catch(error => {
      console.error("Error writing document: ", error);
    });
  }

  render() {
    const { classes, items, products } = this.props;
    const {
      optionClient,
      openDialogItem,
      add,
      product,
      optionProduct,
      client,
      price,
      quantity,
      unitPrice,
      valid,
    } = this.state
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              fullWidth
              disabled={valid}
              value={client}
              onChange={this.handleChangeAutocomplet('client')}
              placeholder="Seleccione el cliente"
              name="react-select-client"
              label="Cliente"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputComponent: SelectWrapped,
                inputProps: {
                  classes,
                  instanceId: 'react-select-client',
                  id: 'react-select-client',
                  simpleValue: true,
                  options: optionClient,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              fullWidth
              disabled={valid}
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
            <Table id="printcontent" className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell numeric>Cantidad</TableCell>
                  <TableCell numeric>Precio Unitario</TableCell>
                  <TableCell numeric>Precio</TableCell>
                  <TableCell numeric className={classes.cellOption} ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map(item => {
                  return (
                    <TableRow className={classes.row} key={item.key}>
                      <TableCell component="th" scope="row">
                        {products.find(p => p.key === item.product).name}
                      </TableCell>
                      <TableCell numeric>{item.quantity}</TableCell>
                      <TableCell numeric>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell numeric>{formatCurrency(item.price)}</TableCell>
                      <TableCell className={classes.cellOption} numeric>
                        {
                          !valid &&
                          <div>
                            <IconButton
                              color="secondary"
                              className={classes.button}
                              aria-label="Modificar Elemento"
                              onClick={() => this.handleopenDialogItem(item)}
                            >
                              <Icon className={classes.iconOption} >create</Icon>
                            </IconButton>
                            <IconButton
                              className={classes.button}
                              aria-label="Eliminar Elemento"
                              onClick={() => this.handleButtomDelete(item.key)}
                            >
                              <Icon className={classes.iconOption}>delete</Icon>
                            </IconButton>
                          </div>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
                {
                  !valid &&
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Button
                        onClick={() => this.handleopenDialogItem()}
                        size="small"
                        color="primary"
                        className={classes.buttonAdd}
                      >
                        Añadir un elemento
                    </Button>
                    </TableCell>
                    <TableCell numeric className={classes.cellOption} ></TableCell>
                  </TableRow>
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} numeric>
                    <Typography variant="title" gutterBottom>
                      {`Total: ${formatCurrency(items.reduce((a, b) => a + b.price, 0))}`}
                    </Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </Grid>
        </Grid>
        <Dialogs
          openDialogItem={openDialogItem}
          onCloseItem={() => this.setState({ openDialogItem: false })}
          add={add}
          product={product}
          handleChangeAutocomplet={this.handleChangeAutocomplet}
          optionProduct={optionProduct}
          SelectWrapped={SelectWrapped}
          classes={classes}
          handlerAddItem={this.handlerAddItem}
          handlerModifyItem={this.handlerModifyItem}
          handleChange={this.handleChange}
          price={price}
          quantity={quantity}
          unitPrice={unitPrice}
        />
      </div>
    );
  }
}

Bill.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(billStyles)(Bill);