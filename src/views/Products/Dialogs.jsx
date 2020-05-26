import React from 'react'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "../../components/CustomButtons/Button.jsx";

export default props => {
  return (
    <div>
      <Dialog
        open={props.openDialogAdd}
        onClose={props.onCloseAdd}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {props.force
            ? "Forzar"
            : "Agregar"
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.force
              ? "Coloque la cantidad de producto que hay en el inventario"
              : "Agregue la cantidad de producto para adicionar al inventario"
            }
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="quantity"
            label="Cantidad"
            type="number"
            fullWidth
            inputProps={{ min: "0" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCloseAdd} color="danger">
            Cancelar
            </Button>
          <Button id="button-add" onClick={props.handlerAdd} color="success">
            Aceptar
            </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={props.openDialogModify}
        onClose={props.onCloseModify}
        aria-labelledby="form-dialog-title1"
      >
        <DialogTitle id="form-dialog-title1">
          {
            props.add
              ? "Agregar producto"
              : "Modificar"
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              props.add
                ? "Agregar nombre y valor del nuevo producto"
                : "Modificar el nombre y valor del producto"
            }
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre"
            type="text"
            fullWidth
            inputProps={{ maxLength: "30" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="amount"
            label="Valor"
            type="number"
            fullWidth
            inputProps={{ min: "0" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCloseModify} color="danger">
            Cancelar
            </Button>
          <Button
            id="button-form"
            onClick={props.add ? props.handlerAddProduct : props.handlerModify}
            color="success"
          >
            Aceptar
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
