import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import DescriptionIcon from "@material-ui/icons/Description";
import Warning from "@material-ui/icons/Warning";
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Danger from "components/Typography/Danger.jsx";
import Bill from './Bill';

import { styles } from "./Styles";
import { db } from "../../firebase";

class Bills extends Component {
  state = {
    products: [],
    clients: [],
    loading: false,
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

  render() {
    const { classes } = this.props
    const { products, clients, loading } = this.state

    if (loading) {
      return <div className={classes.progress}><CircularProgress /></div>
    }

    return (
      <div>
        {/* <Button color="primary" round>Lista Facturas</Button> */}
        <Button color="primary" round>Crear</Button>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <DescriptionIcon />
            </CardIcon>
            <p className={classes.cardCategory}>Factura No.</p>
            <h3 className={classes.cardTitle}>50</h3>
          </CardHeader>
          <CardBody>
            <Bill
              clients={clients}
              products={products}
            />
          </CardBody>
          <CardFooter stats>
            <div className={classes.stats}>
              <Danger>
                <Warning />
              </Danger>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                Get more space
                  </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(Bills);
