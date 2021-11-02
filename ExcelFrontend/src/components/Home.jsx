import React, { Component } from "react";
import { Button, Row, Col, Table, Alert } from "react-bootstrap";
import axios from "axios";
import auth from "./authService";

class Home extends Component {
  state = { file: null, downloaded: false, user: auth.getCurrentUser() };
  componentDidMount() {
    console.log("User,", auth.getCurrentUser());
  }
  onFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("authId", this.state.user.id);
    console.log("User id", this.state.user);

    axios
      .post("http://3.18.105.241:3000/excelFile/uploadFile", formData, {
        headers: {
          Authorization: auth.getJWT(),
        },
      })
      .then((response) => {
        console.log("Upload response", response);
        this.setState({
          uploaded: {
            type: "success",
            msg: "Upload Success",
          },
        });
      })
      .catch((err) => {
        this.setState({
          uploaded: {
            type: "danger",
            msg: "Upload Failed",
          },
        });
        console.log("Upload Error ", err.response.data);
      });
  };
  handleDownload = () => {
    console.log("Toekn", auth.getJWT());
    axios
      .get(
        `http://3.18.105.241:3000/excelFile/downloadFile/${this.state.user.id}`
      )
      .then((res) => {
        console.log("Response", res.config.url);

        window.location.href = res.config.url;
        this.setState({
          downloaded: false,
        });
      })
      .catch((err) => {
        console.log("Download Error ", err.response);
      });
  };
  render() {
    if (this.state.user)
      return (
        <Row>
          <Col>
            <br />
            <h4 className=" mt-0">Upload Excel File</h4>
            <Row>
              <Col md={6} xs={8} className=" pt-3">
                <Row>
                  <Col md={7}>
                    <input
                      className="mb-2"
                      type="file"
                      onChange={this.onFileChange}
                    />
                  </Col>
                </Row>
                <br />
                {this.state.file && (
                  <Row>
                    <Col md={5}>
                      <Button variant="info" onClick={this.onFileUpload}>
                        Upload Selected file
                      </Button>
                    </Col>
                  </Row>
                )}

                <br />
                {this.state.uploaded && (
                  <Alert variant={this.state.uploaded.type}>
                    {this.state.uploaded.msg}
                  </Alert>
                )}

                <br />
                <Button
                  onClick={this.handleDownload}
                  className="mb-3"
                  variant="info"
                >
                  Download File
                </Button>
                {this.state.downloaded && (
                  <Alert variant="danger">Download Failed</Alert>
                )}
              </Col>
              <Col md={6} xs={8}>
                <h6 className="mb-3" style={{ color: "red" }}>
                  The excel file must have one column which must contain name,
                  id of the employee seperated by comma as shown in example..
                </h6>
                <Table striped bordered hover responsive>
                  <thead className="tabelHeader">
                    <tr>
                      <th>employes</th>
                    </tr>
                  </thead>
                  <tbody className="tabelBody">
                    <tr>
                      <td>abc, 0001</td>
                    </tr>
                    <tr>
                      <td>def, 0002</td>
                    </tr>
                    <tr>
                      <td>ghi, 0003</td>
                    </tr>
                    <tr>
                      <td>jkl, 0004</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    else return <h2 className="contentCenter">Register Or SignIn First</h2>;
  }
}

export default Home;
