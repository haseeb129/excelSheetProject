import React, { Component } from "react";
import axios from "axios";
import { Table, Button, Form, Alert, Row, Col } from "react-bootstrap/";
import auth from "./authService";

class AdminUserlist extends Component {
  state = {
    user: auth.getCurrentUser(),
    users: [],
    previousPassword: "",
    newPassword: "",
    newPassword1: "",
    missMatch: false,
    updated: false,
    error: false,
    waiting: false,
    changingPassword: false,
    passwordUpdateError: null,
  };

  componentDidMount() {
    axios
      .get("http://3.18.105.241:3000/auth/users")
      .then((response) => {
        console.log("response Admin userLIst", response.data.users);
        this.setState({ users: response.data.users });
      })
      .catch((e) => console.log("Error", e));
  }

  handleUnBlock = async (data) => {
    console.log("data", data);
    const originalState = this.state.users;
    let users = await this.state.users.map((element) => {
      if (element._id === data._id) element.isBlocked = false;
      return element;
    });

    await axios
      .get(`http://3.18.105.241:3000/auth/unblock/${data._id}`) //remove from Database
      .then((res) => {
        console.log("handleUnBlock ", res);
        this.setState({ users: users });
      })
      .catch((err) => {
        alert("ERROR : User Not UnBlocked");
        this.setState({ users: originalState });
      });
  };

  handleBlock = async (data) => {
    console.log("data", data);
    const originalState = this.state.users;
    let users = await this.state.users.map((element) => {
      if (element._id === data._id) element.isBlocked = true;
      return element;
    });

    await axios
      .get(`http://3.18.105.241:3000/auth/block/${data._id}`) //remove from Database
      .then((res) => {
        console.log("handleBlock", res);
        this.setState({ users: users });
      })
      .catch((err) => {
        console.log("error", err.response);
        alert("ERROR : User is Not Blocked");
        this.setState({ users: originalState });
      });
  };

  handleChange = async (e) => {
    await this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.newPassword === this.state.newPassword1) {
      this.setState({
        missMatch: false,
        updated: false,
        error: false,
        waiting: true,
      });
      console.log(this.state);

      axios
        .patch(
          `http://3.18.105.241:3000/auth/updatePassword/${this.state.user.id}`,
          {
            password: this.state.newPassword,
            oldPassword: this.state.previousPassword,
          }
        )
        .then((response) => {
          this.setState({
            updated: true,
            error: false,
            waiting: false,
            missMatch: false,
          });
          console.log("response", response);
        })
        .catch((err) => {
          this.setState({
            updated: false,
            error: true,
            passwordUpdateError: err.response.data.message,
            waiting: false,
            missMatch: false,
          });
          console.log("ERROR", err.response);
        });
    } else {
      this.setState({ missMatch: true });
    }
  };

  render() {
    return (
      <div className="m-2">
        <Button
          variant="default"
          style={{
            backgroundColor: "#ff00fe",
            color: "white",
            fontWeight: "bold",
            outlineColor: "black",
          }}
          className="mb-3"
          onClick={(e) => {
            let { changingPassword } = this.state;
            this.setState({ changingPassword: !changingPassword });
          }}
        >
          Change Admin Password
        </Button>
        {this.state.changingPassword && (
          <Row>
            <Col md={10} lg={7} xs={12}>
              <Form onSubmit={this.handleSubmit} className="mt-3 mb-3">
                <Form.Group controlId="">
                  <Row>
                    <Col md={4}>
                      <Form.Label>Enter Previous Password</Form.Label>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="password"
                        placeholder="Type Here"
                        value={this.state.previousPassword}
                        name="previousPassword"
                        onChange={this.handleChange}
                        required
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group>
                  <Row>
                    <Col md={4}>
                      <Form.Label>Enter New Password</Form.Label>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="password"
                        placeholder="Type Here"
                        value={this.state.newPassword}
                        name="newPassword"
                        onChange={this.handleChange}
                        required
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Row>
                    <Col md={4}>
                      <Form.Label>Re-Enter New Password</Form.Label>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="password"
                        placeholder="Type Here"
                        value={this.state.newPassword1}
                        name="newPassword1"
                        onChange={this.handleChange}
                        required
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Row>
                  <Col md={12}>
                    <Button
                      className="mt-2"
                      variant="Default"
                      type="submit"
                      size="lg"
                      style={{
                        color: "white",
                        background:
                          "linear-gradient(to bottom,#004d40 0%, #009688 100%)",
                      }}
                      block
                    >
                      Update
                    </Button>
                  </Col>
                </Row>
                {this.state.missMatch && (
                  <Alert className="mt-2" variant="danger">
                    Password Not Match
                  </Alert>
                )}
                {this.state.updated && (
                  <Alert className="mt-2" variant="success">
                    Updated Successfully
                  </Alert>
                )}
                {this.state.error && (
                  <Alert className="mt-2" variant="danger">
                    {this.state.passwordUpdateError}
                  </Alert>
                )}
                {this.state.waiting && (
                  <Alert className="mt-2" variant="info">
                    Waiting For Response
                  </Alert>
                )}
              </Form>
            </Col>
          </Row>
        )}
        <Row>
          <Col lg={12} md={12} xs={12}>
            <h3 className=" mb-2">Current Subscribers</h3>
            <Table striped bordered hover responsive>
              <thead className="tabelHeader">
                <tr>
                  <th>Company Name</th>
                  <th>Name</th>
                  <th>Tel</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody className="tabelBody">
                {this.state.users.map((data) => {
                  if (!(data.email === this.state.user.email))
                    return (
                      <tr>
                        <td>{data.companyName}</td>
                        <td>{data.firstName}</td>
                        <td>{data.mobileTel}</td>
                        <td>{data.email}</td>
                        <td>10/06/2020</td>
                        {!data.isBlocked && (
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => this.handleBlock(data)}
                            >
                              Block
                            </Button>
                          </td>
                        )}
                        {data.isBlocked && (
                          <td>
                            <Button
                              variant="success"
                              onClick={() => this.handleUnBlock(data)}
                            >
                              UnBlock
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AdminUserlist;
