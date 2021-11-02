import React, { Component } from "react";
import { Alert, Button, Form, Row, Col } from "react-bootstrap/";
import axios from "axios";
import auth from "./authService";
export default class SignIn extends Component {
  state = {
    email: "",
    password: "",
    result: null,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state);

    const userObject = {
      email: this.state.email,
      password: this.state.password,
    };
    console.log("User Object", userObject);
    await axios
      .post("http://3.18.105.241:3000/auth/login", userObject)
      .then(async (response) => {
        console.log("Login Response", response);
        const user = response.data.user;
        await auth.logout();
        await auth.loginWithJWT(response.data.token);

        window.location = "/";
      })
      .catch((err) => {
        console.log("Login Error", err.response);

        this.setState({ result: err.response.data.message });
      });
  };
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h1 className="">Sign in</h1>

        <Row className="">
          <Col lg={10} md={10} xs={12}>
            <Form.Group controlId="">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                onChange={this.handleChange}
                required
                name="email"
                value={this.state.email}
                placeholder="Enter Email"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="">
          <Col lg={10} md={10} xs={12}>
            <Form.Group controlId="">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={this.handleChange}
                required
                name="password"
                value={this.state.password}
                placeholder="Enter Password"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-2 ">
          <Col lg={10} md={10} xs={12}>
            <Button variant="primary" size="lg" block type="submit">
              Login
            </Button>
            <br />
            {this.state.result && (
              <h5>
                <Alert variant="danger">{this.state.result}</Alert>
              </h5>
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}
