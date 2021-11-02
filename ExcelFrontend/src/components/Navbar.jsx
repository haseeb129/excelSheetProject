import React, { Component } from "react";
import { Navbar, Nav, Badge, NavLink } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Alert, Button, Form, Row, Col } from "react-bootstrap/";
import Logo from "../Logo.jpg";
import Logo1 from "../RectangularLogo.jpg";
import auth from "./authService";

export default class SampleNavbar extends Component {
  state = {
    user: auth.getCurrentUser(),
    roles: null,
  };

  handleLogout = () => {
    auth.logout();
    window.location = "/";
  };
  render() {
    return (
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="light"
        style={{ backgroundColor: "#ff00fe", color: "white" }}
      >
        <Navbar.Brand href="/">
          <img
            alt=""
            src={Logo1}
            width="130"
            height="30"
            className="d-inline-block align-top"
          />
          <span
            className="ml-2"
            style={{ fontSize: "80%", fontWeight: "bold", color: "white" }}
          >
            Random Testing Selection App
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            {this.state.user && this.state.user.isAdmin && (
              <LinkContainer
                style={{
                  marginRight: "1rem",
                  color: "white",
                }}
                to="/admin"
              >
                <NavLink>User Table</NavLink>
              </LinkContainer>
            )}
            {this.state.user && (
              <LinkContainer
                style={{
                  marginRight: "2rem",
                  color: "white",
                }}
                to="/addemployee"
              >
                <NavLink>Add Employee</NavLink>
              </LinkContainer>
            )}
            {!this.state.user && (
              <LinkContainer
                style={{
                  marginRight: "1rem",
                  color: "white",
                }}
                to="/signin"
              >
                <NavLink>SignIn</NavLink>
              </LinkContainer>
            )}
            {!this.state.user && (
              <LinkContainer
                style={{
                  marginRight: "1rem",
                  color: "white",
                }}
                to="/signup"
              >
                <NavLink>Register</NavLink>
              </LinkContainer>
            )}

            {this.state.user && (
              <Button
                variant="outline-light"
                onClick={this.handleLogout}
                style={{
                  marginRight: "1rem",
                }}
              >
                SignOut
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
