import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import loginPageStyle from "assets/jss/material-dashboard-react/views/loginPage.jsx";
import image from "assets/img/bg7.jpg";

class Start extends React.Component {
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
        /> 
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(Start);
