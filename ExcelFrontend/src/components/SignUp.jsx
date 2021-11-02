import React, { Component } from "react";
import { Alert, Button, Form, Row, Col } from "react-bootstrap/";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import csc from "country-state-city";

import axios from "axios";
export default class SignUp extends Component {
  state = {
    roles: this.props.roles,
    firstName: "",
    lastName: "",
    email: "",
    password1: "",
    password2: "",
    title: "",

    companyName: "",
    country: null,
    state: null,
    countries: null,
    states: null,

    workNumber: null,

    town: "",
    error: { type: "", message: "" },
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  formFielddsCheck = async () => {
    let error = {};
    const state = await this.state;
    if (state.password1 !== state.password2) {
      error = {
        type: "danger",
        message: "password not match",
      };
      await this.setState({ error });
      return false;
    } else if (!state.country || !state.state) {
      error = {
        type: "danger",
        message: "Select Country and State",
      };
      this.setState({ error });
      return false;
    } else if (!state.workNumber) {
      error = {
        type: "danger",
        message: "Enter Wrok Phone number",
      };
      this.setState({ error });
      return false;
    } else {
      this.setState({ error: null });
      return true;
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (await this.formFielddsCheck()) {
      const userObject = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password1,
        roleId: this.state.roles[0]._id,
        title: this.state.title,

        country: this.state.country.label,
        county: this.state.state.label,
        workTel: this.state.workNumber,

        companyName: this.state.companyName,
        street1: this.state.street1,
        street2: this.state.street2,
        town: this.state.town,
      };
      console.log("User Object", userObject);

      axios
        .post("http://3.18.105.241:3000/auth/signup", userObject)
        .then((res) => {
          console.log("Response Sign Up", res);
          let error = {
            type: "success",
            message: "please check your email for account activation",
          };
          this.setState({ error });
        })
        .catch((err) => {
          let error = {
            type: "danger",
            message: err.response.data.message,
          };
          this.setState({ error });
          console.log("Error sign up", err.response.data.message);
        });
    }
  };

  getIdAndName = async (arr) => {
    const newArray = await arr.map((opt) => ({
      label: opt.name,
      value: opt.id,
      sortname: opt.sortname ? opt.sortname.toLowerCase() : null,
    }));

    return newArray;
  };

  fetchData = async (name, id) => {
    if (
      name == "countries" &&
      this.state.country === null &&
      this.state.countries === null
    ) {
      const countries = await this.getIdAndName(csc.getAllCountries());

      this.setState({ countries });
    } else if (
      name == "states" &&
      this.state.state === null &&
      this.state.states === null
    ) {
      const states = await this.getIdAndName(csc.getStatesOfCountry(id));
      // console.log("states");
      this.setState({ states });
      // console.log(states);
    }
  };
  componentDidMount() {
    this.fetchData("countries");
    console.log("Sign Up", this.state.roles);
  }
  onCountrySelect = (e) => {
    this.setState({ country: null }, () =>
      this.setState({ country: e }, () => {
        this.setState({ states: null, state: null }, () => {
          this.fetchData("states", e.value);
        });
      })
    );
  };
  onStateSelect = (e) => {
    this.setState({ state: e });
  };
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h1 className="">Register</h1>
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Row>
              <Col lg={10} md={10} xs={12}>
                <Form.Group>
                  <Form.Label>Company Name*</Form.Label>
                  <Form.Control
                    type="companyName"
                    onChange={this.handleChange}
                    required
                    name="companyName"
                    value={this.state.companyName}
                    placeholder="Enter Company Name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={5} md={5} xs={6}>
                <Form.Group>
                  <Form.Label>First Name*</Form.Label>
                  <Form.Control
                    type="firstName"
                    onChange={this.handleChange}
                    required
                    name="firstName"
                    value={this.state.firstName}
                    placeholder="First Name"
                  />
                </Form.Group>
              </Col>
              <Col lg={5} md={5} xs={6}>
                <Form.Group controlId="">
                  <Form.Label>Surname*</Form.Label>
                  <Form.Control
                    type="lastName"
                    onChange={this.handleChange}
                    required
                    name="lastName"
                    value={this.state.lastName}
                    placeholder="Last Name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4} lg={4} xs={4}>
                <Form.Group controlId="">
                  <Form.Label>Street 1*</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={this.handleChange}
                    required
                    name="street1"
                    value={this.state.street1}
                    placeholder="Enter Street 1"
                  />
                </Form.Group>
              </Col>
              <Col md={3} lg={3} xs={4}>
                <Form.Group controlId="">
                  <Form.Label>Street 2</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={this.handleChange}
                    name="street2"
                    value={this.state.street2}
                    placeholder="Enter Street 2"
                  />
                </Form.Group>
              </Col>
              <Col md={3} lg={3} xs={4}>
                <Form.Group controlId="">
                  <Form.Label>Town*</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={this.handleChange}
                    required
                    name="town"
                    value={this.state.town}
                    placeholder="Enter Town"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={5} lg={5} xs={6}>
                <h6>Select Country</h6>
                <Select
                  options={this.state.countries}
                  onChange={this.onCountrySelect}
                />
              </Col>
              {this.state.states && (
                <Col md={5} lg={5} xs={6}>
                  <h6>Select State</h6>
                  <Select
                    value={this.state.state}
                    options={this.state.states}
                    onChange={this.onStateSelect}
                    defaultValue={this.state.state}
                  />
                </Col>
              )}
            </Row>

            <Row className="mt-2">
              <Col md={5} lg={5} xs={6}>
                <h6>
                  Email*
                  <span style={{ fontSize: "70%" }}>
                    (this will be your Login Username)
                  </span>
                </h6>

                <Form.Control
                  type="email"
                  onChange={this.handleChange}
                  required
                  name="email"
                  value={this.state.email}
                  placeholder="Enter Email"
                />
              </Col>
              {this.state.country && (
                <Col md={5} lg={5} xs={6}>
                  <h6>
                    Phone Number*
                    <span style={{ fontSize: "70%" }}>(Work)</span>
                  </h6>
                  <PhoneInput
                    containerClass={Form.Control}
                    required
                    countryCodeEditable={false}
                    value={this.state.workNumber}
                    onlyCountries={[this.state.country.sortname]}
                    country={this.state.country.sortname}
                    onChange={(phone) => this.setState({ workNumber: phone })}
                  />
                </Col>
              )}
            </Row>

            <Row className="">
              <Col md={5} lg={5} xs={6}>
                <Form.Group controlId="">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    onChange={this.handleChange}
                    required
                    name="password1"
                    value={this.state.password1}
                    placeholder="Password"
                  />
                </Form.Group>
              </Col>

              <Col lg={5} md={5} xs={6}>
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    onChange={this.handleChange}
                    required
                    name="password2"
                    value={this.state.password2}
                    placeholder="Password"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2 ">
              <Col lg={10} md={10} xs={12}>
                <Button variant="primary" size="lg" block type="submit">
                  Sign Up
                </Button>
                <br />
                {this.state.error && (
                  <h5>
                    <Alert variant={this.state.error.type}>
                      {this.state.error.message}
                    </Alert>
                  </h5>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}
