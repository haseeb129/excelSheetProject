import React, { Component } from "react";
import { Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import auth from "./authService";
class ActivationPage extends Component {
  state = {};

  handleActiavte = (e) => {
    console.log("Activating Account Token", this.props.match.params.token);
    axios
      .post("http://3.18.105.241:3000/auth/activateaccount", {
        token: this.props.match.params.token,
      })
      .then(async (res) => {
        console.log("Actiavtion response", res);
        await auth.logout();
        await auth.loginWithJWT(res.data.token);
        window.location = "/";
      })
      .catch((err) => {
        console.log("Actiavtion Error ", err.response);
      });
  };
  componentDidMount() {
    console.log("Props", this.props);
  }
  render() {
    return (
      <div className="wrapper1">
        <Button
          style={{ background: "linear-gradient(to right,#7E0F4B, #1A5865" }}
          className="button2"
          size="lg"
          onClick={this.handleActiavte}
        >
          <span className="buttonText"> Activate</span>
        </Button>
      </div>
    );
  }
}

export default ActivationPage;
