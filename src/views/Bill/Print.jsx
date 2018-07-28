import React, { Component } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TableFooter from '@material-ui/core/TableFooter';
import Grid from '@material-ui/core/Grid';
import { pad2, formatCurrency } from "utils";

const Header = props => {
  return (
    <header>
      <div className="title">
        <img
          src="https://www.w3schools.com/images/w3schools_green.jpg"
          alt="W3Schools.com"
          style={{ height: "70px" }}
        />
        <div>Fama el Triunfo</div>
      </div>
      <hr className="line" />
    </header>
  );
};

const Footer = props => {
  return (
    <footer>
      <hr className="line" />
      <div className="footer-text">
        <div>Dirección: Avenida Falsa 123</div>
        <div>Telefono: 3107777777</div>
      </div>
    </footer>
  );
};

const Page = props => {
  return (
    <div className="subpage">
      <Header />
      <div {...props} className="body">
        {props.children}
      </div>
      <Footer />
    </div>
  );
};

class Print extends Component {
  state = {
    height: 0
  }
  constructor(props) {
    super(props)

    this.state = {
      height: 0
    }
  }

  render() {
    const { bill, client, items, products } = this.props
    const dateBill = bill.date.toDate()
    if (!bill.valid) { return <div /> }
    return (
      <div className="section-print">
        <Page>
          <div className="bill-wrapper" >
            <div className="bill">
              <h3>{`Factura ${bill.number.toString().padStart(4, "0")}`}</h3>
              <h6><b>Fecha Factura:</b></h6>
              <div>{`${dateBill.getFullYear()}-${pad2(dateBill.getMonth() + 1)}-${pad2(dateBill.getDate())}`}</div>
            </div>
            <div className="client-wrapper">
              <h4><b>{client.name}</b></h4>
              <h6>{client.address}</h6>
              <h6>{client.phone}</h6>
              <h6>{client.id}</h6>
            </div>
          </div>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell><b>Producto</b></TableCell>
                <TableCell numeric><b>Cantidad</b></TableCell>
                <TableCell numeric><b>Precio Unitario</b></TableCell>
                <TableCell numeric><b>Precio</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => {
                return (
                  <TableRow className="row-bill" key={item.key}>
                    <TableCell component="th" scope="row">
                      {products.find(p => p.key === item.product).name}
                    </TableCell>
                    <TableCell numeric>{item.quantity}</TableCell>
                    <TableCell numeric>{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell numeric>{formatCurrency(item.price)}</TableCell>
                  </TableRow>
                );
              })}
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
          <Grid className="firms" container>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <hr />
              <Typography variant="caption" gutterBottom align="center">
                Firma Autorizada
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <hr />
              <Typography variant="caption" gutterBottom align="center">
                Aceptada Firma y Sello Cliente
              </Typography>
            </Grid>
          </Grid>
        </Page>
      </div>
    );
  }
}


export default Print