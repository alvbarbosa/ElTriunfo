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
        open={props.openDialogModify}
        onClose={props.onCloseModify}
        aria-labelledby="form-dialog-title1"
      >
        <DialogTitle id="form-dialog-title1">
          {
            props.add
              ? "Agregar Cliente"
              : "Modificar"
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              props.add
                ? "Agregar Cliente"
                : "Modificar Cliente"
            }
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre"
            type="text"
            fullWidth
            inputProps={{ maxLength: "50" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="id"
            label="Identificación"
            type="text"
            fullWidth
            inputProps={{ maxLength: "50" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="address"
            label="Dirección"
            type="text"
            fullWidth
            inputProps={{ maxLength: "150" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="phone"
            label="Telefono"
            type="text"
            fullWidth
            inputProps={{ maxLength: "50" }}
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
            onClick={props.add ? props.handlerAddClient : props.handlerModify}
            color="success"
          >
            Aceptar
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
