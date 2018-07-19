import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutline";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import loginPageStyle from "assets/jss/material-dashboard-react/views/loginPage.jsx";
import image from "assets/img/bg7.jpg";
import { auth, errFirebase } from "../../firebase";

class LoginPage extends React.Component {
  state = {
    cardAnimaton: "cardHidden",
    email: '',
    password: '',
    tc: false,
    message: "",
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  handleForm = e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        console.log(user);
      }).catch(err => {
        console.log(err);
        this.setState({
          message: errFirebase(err.code),
          tc: true
        })
        setTimeout(() => {
          this.setState({ tc: false })
        }, 6000);
      })
  }
  handleEmail = event => {
    this.setState({ email: event.target.value })
  }
  handlePassword = event => {
    this.setState({ password: event.target.value })
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form onSubmit={this.handleForm} className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Ingresar</h4>
                    </CardHeader>
                    <CardBody>
                      <CustomInput
                        labelText="Correo Electrónico..."
                        id="email"
                        formControlProps={{
                          fullWidth: true,
                          required: true,
                        }}
                        inputProps={{
                          onChange: this.handleEmail,
                          value: this.state.email,
                          type: "email",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Contraseña"
                        id="pass"
                        value={this.state.password}
                        formControlProps={{
                          fullWidth: true,
                          required: true
                        }}
                        inputProps={{
                          type: "password",
                          onChange: this.handlePassword,
                          value: this.state.password,
                          endAdornment: (
                            <InputAdornment position="end">
                              <LockOutline
                                className={classes.inputIconsColor}
                              />
                            </InputAdornment>
                          )
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button type="submit" simple color="primary" size="lg">
                        Entrar
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          {/* <Footer whiteFont /> */}
        </div>
        <Snackbar
          place="tc"
          color="danger"
          icon={ErrorIcon}
          message={this.state.message}
          open={this.state.tc}
          closeNotification={() => this.setState({ tc: false })}
          close
        />
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
