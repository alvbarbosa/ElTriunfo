import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutline";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import DoneIcon from "@material-ui/icons/Done";
// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Snackbar from "../../components/Snackbar/Snackbar.jsx";
import loginPageStyle from "../../assets/jss/material-dashboard-react/views/loginPage.jsx";
import image from "../../assets/img/bg7.jpg";
import { auth, errFirebase } from "../../firebase";

const FormRemember = props => {
  const {
    handleFormRemember,
    handleEmail,
    email,
    handleCancel,
    classes
  } = props
  return (
    <form onSubmit={handleFormRemember} className={classes.form}>
      <CardHeader color="primary" className={classes.cardHeader}>
        <h4>Recordar Contraseña</h4>
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
            onChange: handleEmail,
            value: email,
            type: "email",
            endAdornment: (
              <InputAdornment position="end">
                <Email className={classes.inputIconsColor} />
              </InputAdornment>
            )
          }}
        />
      </CardBody>
      <CardFooter className={classes.cardFooter}>
        <Button type="submit" simple color="primary" size="lg">
          Enviar
        </Button>
        <Button className={classes.remember} onClick={handleCancel} simple size="sm">
          Cancelar
        </Button>
      </CardFooter>
    </form>
  )
}

const FormLogin = props => {
  const {
    handleForm,
    classes,
    handleEmail,
    email,
    password,
    handlePassword,
    handleRemember
  } = props
  return (
    <form onSubmit={handleForm} className={classes.form}>
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
            onChange: handleEmail,
            value: email,
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
          value={password}
          formControlProps={{
            fullWidth: true,
            required: true
          }}
          inputProps={{
            type: "password",
            onChange: handlePassword,
            value: password,
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
        <Button className={classes.remember} onClick={handleRemember} simple size="sm">
          Recordar Contraseña
        </Button>
      </CardFooter>
    </form>
  )
}

class LoginPage extends React.Component {
  state = {
    cardAnimaton: "cardHidden",
    email: '',
    password: '',
    tc: false,
    tc1: false,
    message: "",
    remember: false,
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
  handleFormRemember = e => {
    e.preventDefault()
    auth.sendPasswordResetEmail(this.state.email)
      .then(() => {
        this.setState({
          message: `Se envio un link a ${this.state.email} para reestablecer su contraseña`,
          tc1: true,
          remember: false
        })
        setTimeout(() => {
          this.setState({ tc1: false })
        }, 6000);
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
                  {this.state.remember
                    ? <FormRemember
                      handleFormRemember={this.handleFormRemember}
                      classes={classes}
                      handleEmail={this.handleEmail}
                      email={this.state.email}
                      handleCancel={() => this.setState({ remember: false })}
                    />
                    : <FormLogin
                      {...this.state}
                      handleForm={this.handleForm}
                      classes={classes}
                      handleEmail={this.handleEmail}
                      handlePassword={this.handlePassword}
                      handleRemember={() => this.setState({ remember: true })}
                    />}
                </Card>
              </GridItem>
            </GridContainer>
          </div>
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
        <Snackbar
          place="tc"
          color="success"
          icon={DoneIcon}
          message={this.state.message}
          open={this.state.tc1}
          closeNotification={() => this.setState({ tc1: false })}
          close
        />
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
