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
    <header style={{ width: '100%' }} id="prueba">
      <div
        className="title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingRight: 15,
          alignItems: 'flex-end'
        }}
      >
        <img
          src={logo}
          alt="W3Schools.com"
          style={{ height: "30px" }}
        />
        <div>
          <Typography className="title-typo" style={{ margin: 0, padding: 0 }} variant="subheading" gutterBottom>
            Carnes el Triunfo L.A.
          </Typography>
          <Typography className="title-typo" style={{ margin: 0, padding: 0 }} variant="caption" gutterBottom align="center">
            La excelencia en Carnes
          </Typography>
        </div>
      </div>
      <hr className="line" style={{ marginTop: 1, marginBottom: 1 }} />
    </header>
  );
};
const Page = props => {
  return (
    <div
      className="subpage"
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
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
        <div className="bill-wrapper" style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10, marginBottom: 20 }} >
          <div className="bill">
            <Typography style={{ fontWeight: 'bold' }} className="title-typo" variant="body2" gutterBottom>
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
        <Table style={{ width: '100%' }} className="table">
          <TableHead>
            <TableRow className="row-bill" style={{ height: 'auto !important', pageBreakInside: 'avoid' }} >
              <TableCell style={{ textAlign: 'left', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}><b>Producto</b></TableCell>
              <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }} numeric><b>Cantidad</b></TableCell>
              {/* <TableCell numeric><b>Precio Unitario</b></TableCell> */}
              <TableCell style={{ textAlign: 'right', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} numeric><b>Precio</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => {
              return (
                <TableRow className="row-bill" key={item.key}>
                  <TableCell style={{ textAlign: 'left', fontWeight: 100, borderBottom: '1px solid rgba(224, 224, 224, 1)' }} component="th" scope="row">
                    {products.find(p => item.product.value ? p.key === item.product.value : p.key === item.product).name}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} numeric>{item.quantity}</TableCell>
                  {/* <TableCell numeric>{formatCurrency(item.unitPrice)}</TableCell> */}
                  <TableCell style={{ textAlign: 'right', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} numeric>{formatCurrency(item.price)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter style={{
            textAlign: 'right',
            width: '100%',
            fontWeight: 'bold',
            display: 'table',
            marginTop: 10
          }}>
            <TableRow>
              <TableCell style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }} colSpan={4} numeric>
                <Typography variant="body2" gutterBottom>
                  {`Total: ${formatCurrency(items.reduce((a, b) => a + b.price, 0))}`}
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </Page >
    )
  }
  render() {
    const { bill } = this.props
    if (!bill.valid) { return <div /> }
    return (
      <div style={{ display: 'none' }} id="divcontents">
        <div
          className="section-print"
          style={{
            display: 'flex',
            flex: 1,
            height: '100%',
            flexDirection: 'column'
          }}
        >
          <div className="section" style={{ flex: 1, position: 'relative' }} >
            {this.sectionBill()}
            <div
              className="original-copy"
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                textAlign: 'center'
              }}
            >
              Original
            </div>
          </div>
          <hr className="clipping" style={{ borderStyle: 'dashed', width: '100%' }} />
          <div className="section" style={{ flex: 1, position: 'relative' }} >
            {this.sectionBill()}
            <div
              className="original-copy"
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                textAlign: 'center'
              }}
            >
              Copia
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default Print