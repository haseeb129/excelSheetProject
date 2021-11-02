import React, { Component } from "react";

import axios from "axios";
import { Table, Button, Form, Alert, Row, Col } from "react-bootstrap/";
import auth from "./authService";

class UserList extends Component {
  state = {
    employees: [],
    user: auth.getCurrentUser(),
    employeeName: null,
  };

  componentDidMount() {
    axios
      .get(`http://3.18.105.241:3000/employes/getAll/${this.state.user.id}`, {
        headers: {
          Authorization: auth.getJWT(),
        },
      })
      .then((response) => {
        console.log("response", response.data.employees);
        this.setState({ employees: response.data.employees });
      })
      .catch((e) => console.log("Error", e));
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDelete = async (data) => {
    console.log("data", data);
    const originalState = this.state.employees;
    const employees = this.state.employees.filter((c) => c._id !== data._id);
    this.setState({ employees: employees }); //remove from state

    await axios
      .delete(`http://3.18.105.241:3000/employes/removeEmployee/${data._id}`, {
        headers: {
          Authorization: auth.getJWT(),
        },
      }) //remove from Database
      .then((res) => {
        alert("Employees Deleted Successfully ");
      })
      .catch((err) => {
        alert("ERROR : Employees Not Deleted");
        this.setState({ employees: originalState });
      });
  };

  handleAdd = () => {
    console.log("this.state.employeeName", this.state.employeeName);
    if (this.state.employeeName !== "") {
      axios
        .post(
          `http://3.18.105.241:3000/employes/addEmployee/${this.state.user.id}`,
          { employeName: this.state.employeeName },
          {
            headers: {
              Authorization: auth.getJWT(),
            },
          }
        )
        .then((response) => {
          const { employees } = this.state;
          employees.push(response.data.newEmployee);
          this.setState({ employees });
          console.log("response", response);
        })
        .catch((err) => console.log("Add Employee Error", err.response));
    }
  };
  handleTrueRandomSelection = () => {
    axios
      .get(
        `http://3.18.105.241:3000/employes/trueRandomSelection/${this.state.user.id}`,
        {
          headers: {
            Authorization: auth.getJWT(),
          },
        }
      )
      .then((res) => {
        this.setState({ trueRandomSelection: res.data.employee.employeName });
      })
      .catch((err) => console.log("err", err));
  };
  handleSequentialRandomSelection = () => {
    console.log("sequentialRandomSelection");
    axios
      .get(
        `http://3.18.105.241:3000/employes/sequentialRandomSelection/${this.state.user.id}`,
        {
          headers: {
            Authorization: auth.getJWT(),
          },
        }
      )
      .then((res) => {
        console.log("sequentialRandomSelection");
        this.setState({
          sequentialRandomSelection: res.data.employee.employeName,
        });
      })
      .catch((err) => console.log("err", err));
  };

  handleSequentialFlagReset = () => {
    console.log("handleSequentialFlagReset");
    axios
      .get(
        `http://3.18.105.241:3000/employes/sequentialFlagReset/${this.state.user.id}`,
        {
          headers: {
            Authorization: auth.getJWT(),
          },
        }
      )
      .then((res) => {
        console.log("res", res);
        this.setState({
          employees: res.data.employees,
        });
      })
      .catch((err) => console.log("err", err));
  };

  render() {
    return (
      <div className="container pt-4">
        <Row className="">
          <Col className="mt-2" md={3} xs={6}>
            <Form.Control
              type="text"
              placeholder="Employee (Selection)"
              disabled="true"
              name="trueRandomSelection"
              value={this.state.trueRandomSelection}
              onChange={this.handleTrueRandomSelection}
            />
          </Col>
          <Col className="mt-2" md={3} xs={6}>
            <Button
              block
              onClick={this.handleTrueRandomSelection}
              variant="info"
            >
              True Random
            </Button>
          </Col>
          <Col className="mt-2" md={3} xs={6}>
            <Form.Control
              type="text"
              placeholder="Employee (Selection)"
              disabled="true"
              name="sequentialRandomSelection"
              value={this.state.sequentialRandomSelection}
              onChange={this.handleSequentialRandomSelection}
            />
          </Col>
          <Col className="mt-2" md={3} xs={6}>
            <Button
              onClick={this.handleSequentialRandomSelection}
              variant="info"
              block
            >
              Sequential Random
            </Button>
          </Col>
        </Row>

        <Row className="mt-2 mb-4">
          <Col md={3} xs={6}>
            <Form.Control
              className="mb-2"
              type="text"
              placeholder="Enter Employee Name"
              name="employeeName"
              value={this.state.employeeName}
              onChange={this.handleChange}
            />
          </Col>
          <Col md={3} xs={6}>
            <Button block onClick={this.handleAdd} variant="success">
              Add Employee
            </Button>
          </Col>
          {/* <Alert variant="danger">asasasa</Alert> */}
        </Row>
        <Row>
          <Col md={12} xs={12}>
            <h3 className=" mb-2">Employee Table</h3>
            <Table striped bordered hover responsive>
              <thead className="tabelHeader">
                <tr>
                  <th>Employee Name</th>
                  <th>Last Selected</th>
                  <th>Selected After Last Reset</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="tabelBody">
                {this.state.employees.map((data) => {
                  return (
                    <tr>
                      <td>{data.employeName}</td>
                      <td>{data.lastSelected}</td>
                      <td>{data.isSelectedAfterLastReset ? "YES" : "NO"}</td>

                      <td>
                        <Button
                          variant="danger"
                          onClick={() => this.handleDelete(data)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Button
              className="mb-4"
              variant="danger"
              size="lg"
              onClick={this.handleSequentialFlagReset}
            >
              Sequential Flag Reset
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserList;
