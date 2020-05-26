import React, { Component } from 'react'
import moment from 'moment'
//import ReactToPrint from "react-to-print";
import { withStyles } from '@material-ui/core/styles';
import DescriptionIcon from "@material-ui/icons/Description";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import Warning from "@material-ui/icons/Warning";
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import DoneIcon from "@material-ui/icons/Done";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import Danger from "../../components/Typography/Danger.jsx";
import Snackbar from "../../components/Snackbar/Snackbar.jsx";
import Iframe from 'react-iframe';
import Bill from './Bill';
import List from './List'
import PrintBill from './Print';

import { styles } from "./Styles";
import { db } from "../../firebase";
import './styles.css'

const TitleBill = props => {
  const { bill, classes, viewList } = props
  if (viewList) {
    return <div>
      <p className={classes.cardCategory}></p>
      <h3 className={classes.cardTitle}>Lista Facturas</h3>
    </div>
  } else {
    if (bill.valid) {
      return <div>
        <p className={classes.cardCategory}>Factura No.</p>
        <h3 className={classes.cardTitle}>{bill.number}</h3>
      </div>
    } else {
      return <div>
        <p className={classes.cardCategory}></p>
        <h3 className={classes.cardTitle}>Factura Borrador</h3></div>
    }
  }
}

class ButtonHeader extends Component {
  printMethod = () => {
    var content = document.getElementById("divcontents");
    var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  }
  render() {
    const {
      bill,
      viewList,
      handleViewList,
      createBill,
      deleteBill,
      validateBill,
      items,
      clients,
      products,
    } = this.props
    if (viewList) {
      return <Button onClick={createBill} size="sm" color="primary" round>Crear</Button>
    } else {
      return <div style={{ display: 'flex', justifyContent: 'space-between' }} >
        {bill.valid
          ? <div>
            <Button
              size="sm"
              color="primary"
              round
              onClick={() => this.printMethod()}
            >
              Imprimir
            </Button>
            {/* <ReactToPrint
              trigger={() => <Button size="sm" color="primary" round>Imprimir</Button>}
              content={() => this.componentRef}
            /> */}
            <PrintBill
              //ref={el => (this.componentRef = el)}
              bill={bill}
              client={clients.find(c => bill.client.value ? c.key === bill.client.value : c.key === bill.client)}
              items={items}
              products={products}
            />
          </div>
          : <div>
            <Button onClick={validateBill} size="sm" color="primary" round>Validar</Button>
            <Button onClick={deleteBill} size="sm" round>Descartar</Button>
          </div>
        }
        <Button size="sm" color="primary" onClick={handleViewList} round>Lista Facturas</Button>
      </div>
    }
  }
}

class Bills extends Component {
  state = {
    products: [],
    clients: [],
    loading: false,
    bill: null,
    bills: [],
    items: [],
    viewList: true,
    tc: false,
    message: "",
    colorSnack: "danger",
    iconSnack: ErrorIcon
  }
  componentDidMount = async () => {
    try {

      this.setState({ loading: true })
      let querySnapshot = await db.collection("products").get()
      let products = []
      querySnapshot.forEach(doc => {
        products.push({
          ...doc.data(),
          key: doc.id,
        })
      });
      querySnapshot = await db.collection("clients").get()
      let clients = []
      querySnapshot.forEach(doc => {
        clients.push({
          ...doc.data(),
          key: doc.id,
        })
      });
      this.setState({ clients, products, loading: false })

    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }
  componentWillUnmount = () => {
    let unsubscribe = db.collection('bills')
      .onSnapshot(function () { });
    unsubscribe();
    if (this.state.bill) {
      unsubscribe = db.collection('bills').doc(this.state.bill.key).collection('items')
        .onSnapshot(function () { });
      unsubscribe();
    }
  }
  getBills = async dates => {
    await db.collection('bills')
      .where("date", ">=", dates.initialDate.toDate())
      .where("date", "<=", dates.finalDate.toDate())
      .onSnapshot(querySnapshot => {
        let bills = []
        querySnapshot.forEach(doc => {
          let item = doc.data()
          item.key = doc.id
          bills.push(item)
        });
        this.setState({ bills })
      });
  }
  openBill = bill => {
    db.collection('bills').doc(bill.key).collection('items')
      .onSnapshot(querySnapshot => {
        let items = []
        querySnapshot.forEach(doc => {
          let item = doc.data()
          item.key = doc.id
          items.push(item)
        });
        this.setState({ items })
      });
    this.setState({
      bill,
      viewList: false,
      loading: false,
    })
  }

  closeBill = () => {
    const unsubscribe = db.collection('bills').doc(this.state.bill.key).collection('items')
      .onSnapshot(function () { });
    unsubscribe();
  }

  createBill = () => {
    this.setState({ loading: true })
    db.collection('bills').add({
      amountTotal: 0,
      date: new Date(),
      number: 0,
      valid: false,
      client: ""
    }).then(docRef => {
      console.log("Document written with ID: ", docRef.id);
      this.openBill({ key: docRef.id, date: moment(), client: "", valid: false })
    })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  }

  deleteBill = () => {
    const { bill } = this.state
    if (bill.valid) {
      this.showError("No se puede eliminar la factura")
    } else {
      db.collection("bills").doc(bill.key).delete()
        .then(() => {
          this.setState({ viewList: true })
          console.log("Document successfully deleted!");
        }).catch(error => {
          console.error("Error removing document: ", error);
        });
    }
  }

  validateBill = async () => {
    try {
      const { items, bills, bill: { key } } = this.state
      const bill = bills.find(b => b.key === key)
      if (items.length <= 0) {
        this.showError("La factura no tiene detalles")
      } else if (!bill.client) {
        this.showError("Seleccione el Cliente")
      } else if (bill.date.toDate().getTime() === -2211735824000) {
        this.showError("Seleccione la Fecha")
      } else {
        this.setState({ loading: true })
        const amountTotal = items.reduce((a, b) => a + b.price, 0)
        const refParams = db.collection('settings').doc('parameters')
        const refBill = db.collection('bills').doc(key)

        const numberBill = await db.runTransaction(transaction => {
          return transaction.get(refParams).then(sfDoc => {
            if (!sfDoc.exists) {
              throw new Error("Document does not exist!");
            }

            const numberBill = sfDoc.data().numberBill + 1;
            transaction.update(refParams, { numberBill });
            transaction.update(refBill, {
              number: numberBill,
              amountTotal,
              valid: true,
            });

            return numberBill;
          });
        })

        this.showAlert(`Se creo la factura ${numberBill}`)

        let refItem = null
        let quantity = 0
        for (const key in items) {
          if (items.hasOwnProperty(key)) {
            const item = items[key];

            quantity = parseInt(item.quantity, 10)
            refItem = db.collection('products').doc(item.product.value ? item.product.value : item.product)
            await db.runTransaction(async transaction => {
              const sfDoc = await transaction.get(refItem)
              if (!sfDoc.exists) {
                throw new Error("Document does not exist!");
              }

              const total = sfDoc.data().total - quantity;
              await transaction.update(refItem, { total });
              db.collection('productsMov').add({
                date: new Date(),
                id: item.product,
                quantity: `-${quantity}`,
                total,
                note: `Factura No. ${numberBill}`
              })
              return transaction
            })
          }
        }

        bill.valid = true
        bill.number = numberBill
        await this.setState({ loading: false, bill })
      }
    } catch (error) {
      console.log("Transaction failed: ", error);
      this.showError("Error escribiendo la factura")
    }
  }

  showAlert = message => {
    this.setState({
      message,
      tc: true,
      colorSnack: "success",
      iconSnack: DoneIcon
    })
    setTimeout(() => {
      this.setState({ tc: false })
    }, 5000);
  }

  showError = message => {
    this.setState({
      message,
      tc: true,
      colorSnack: "danger",
      iconSnack: ErrorIcon
    })
    setTimeout(() => {
      this.setState({ tc: false })
    }, 5000);
  }

  handleViewList = () => {
    this.closeBill()
    this.setState({ viewList: true })
  }

  render() {
    const { classes } = this.props
    const { products, clients, loading, items, bill, viewList, bills, iconSnack } = this.state

    if (loading) {
      return <div className={classes.progress}><CircularProgress /></div>
    }
    return (
      <div>
        <ButtonHeader
          viewList={viewList}
          bill={bill}
          handleViewList={this.handleViewList}
          createBill={this.createBill}
          deleteBill={this.deleteBill}
          validateBill={this.validateBill}
          items={items}
          clients={clients}
          products={products}
        />
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              {viewList
                ? <FormatListBulletedIcon />
                : <DescriptionIcon />}
            </CardIcon>
            <TitleBill
              bill={bill}
              classes={classes}
              viewList={viewList}
            />
          </CardHeader>
          <CardBody>
            <div className={classes.tableWrapper}>
              {viewList
                ? <List
                  bills={bills}
                  openBill={this.openBill}
                  clients={clients}
                  getBills={this.getBills}
                />
                : <Bill
                  clients={clients}
                  products={products}
                  items={items}
                  bill={bill}
                  showError={this.showError}
                />
              }
            </div>
          </CardBody>
          <CardFooter stats>
            <div className={classes.stats}>
              <Danger>
                <Warning />
              </Danger>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                Factura
                  </a>
            </div>
          </CardFooter>
        </Card>
        <Snackbar
          place="tc"
          color={this.state.colorSnack}
          icon={iconSnack}
          message={this.state.message}
          open={this.state.tc}
          closeNotification={() => this.setState({ tc: false })}
          close
        />
        <div style={{ display: 'none' }}>
          <Iframe url="" id="ifmcontentstoprint" title="ifmcontentstoprint" style={{ height: 0, width: '100%', position: 'absolute' }}></Iframe>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Bills);
