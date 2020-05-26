import React from 'react'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "../../components/CustomButtons/Button.jsx";

import { formatCurrency } from "../../utils";

export default props => {
  const title = props.add ? "Agregar Elemento" : "Modificar Elemento"
  return (
    <div>
      <Dialog
        open={props.openDialogItem}
        onClose={props.onCloseItem}
        aria-labelledby="form-dialog-title1"
      >
        <form onSubmit={props.add ? props.handlerAddItem : props.handlerModifyItem} >
          <DialogTitle id="form-dialog-title1">
            {title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
            <TextField
              autoFocus
              required
              fullWidth
              value={props.product}
              onChange={props.handleChangeAutocomplet('product')}
              placeholder="Seleccione un producto"
              name="react-select-product"
              label="Producto"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputComponent: props.SelectWrapped,
                inputProps: {
                  classes: props.classes,
                  instanceId: 'react-select-product',
                  id: 'react-select-product',
                  simpleValue: true,
                  options: props.optionProduct,
                },
              }}
            />
            <TextField
              required
              fullWidth
              margin="dense"
              name="quantity"
              label="Cantidad"
              type="number"
              value={props.quantity}
              onChange={props.handleChange}
              inputProps={{ min: 0 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              required
              margin="dense"
              name="unitPrice"
              label="Precio Unitario"
              type="number"
              fullWidth
              value={props.unitPrice}
              onChange={props.handleChange}
              inputProps={{ min: 0 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              disabled
              margin="dense"
              name="price"
              label="Precio"
              type="text"
              value={formatCurrency(props.price)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onCloseItem} color="danger">
              Cancelar
            </Button>
            <Button
              //onClick={props.add ? props.handlerAddItem : props.handlerModifyItem}
              type="submit"
              color="success"
            >
              Aceptar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}
