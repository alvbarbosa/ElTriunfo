import React, { Component } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TableFooter from '@material-ui/core/TableFooter';
import logo from 'assets/img/res.png'
import { pad2, formatCurrency } from "utils";

const Header = props => {
  return (
    <header>
      <div className="title">
        <img
          src={logo}
          alt="W3Schools.com"
          style={{ height: "30px" }}
        />
        <div>
          <Typography className="title-typo" variant="subheading" gutterBottom>
            Carnes el Triunfo
          </Typography>
          <Typography className="title-typo" variant="caption" gutterBottom align="center">
            La excelencia en Carnes
          </Typography>
        </div>
      </div>
      <hr className="line" />
    </header>
  );
};
const Page = props => {
  return (
    <div className="subpage">
      <Header />
      <div {...props} className="body">
        {props.children}
      </div>
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
  sectionBill = () => {
    const { bill, client, items, products } = this.props
    const dateBill = bill.date.toDate()
    return (
      <Page>
        <div className="bill-wrapper" >
          <div className="bill">
            <Typography className="title-typo" variant="body2" gutterBottom>
              {`Factura ${bill.number.toString().padStart(4, "0")}`}
            </Typography>
            <Typography className="title-typo" variant="caption" gutterBottom>
              Fecha Factura: {`${dateBill.getFullYear()}-${pad2(dateBill.getMonth() + 1)}-${pad2(dateBill.getDate())}`}
            </Typography>
          </div>
          <div className="client-wrapper">
            <Typography className="title-typo" variant="body2" gutterBottom>
              {client.name}
            </Typography>
            <Typography className="title-typo" variant="caption" gutterBottom>
              {client.address}
            </Typography>
          </div>
        </div>
        <Table className="table">
          <TableHead>
            <TableRow className="row-bill">
              <TableCell><b>Producto</b></TableCell>
              <TableCell numeric><b>Cantidad</b></TableCell>
              {/* <TableCell numeric><b>Precio Unitario</b></TableCell> */}
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
                  {/* <TableCell numeric>{formatCurrency(item.unitPrice)}</TableCell> */}
                  <TableCell numeric>{formatCurrency(item.price)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} numeric>
                <Typography variant="body2" gutterBottom>
                  {`Total: ${formatCurrency(items.reduce((a, b) => a + b.price, 0))}`}
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </Page>
    )
  }
  render() {
    const { bill } = this.props
    if (!bill.valid) { return <div /> }
    return (
      <div className="section-print">
        <div className="section" >
          {this.sectionBill()}
        </div>
        <hr className="clipping" />
        <div className="section" >
          {this.sectionBill()}
        </div>
      </div>
    );
  }
}


export default Print