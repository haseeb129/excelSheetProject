import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import ActivationPage from "./components/ActivationPage";
import "./App.css";
import UserList from "./components/UserList";
import AdminUserlist from "./components/AdminUserlist";
import axios from "axios";
import auth from "./components/authService";
class App extends Component {
  state = { user: auth.getCurrentUser() };
  componentDidMount() {
    console.log("User", this.state.user);
    axios
      .get("http://3.18.105.241:3000/roles/getAll")
      .then((res) => {
        console.log("response", res.data.roles[0]._id);
        this.setState({ roles: res.data.roles });
      })
      .catch((err) => {
        console.log("Roles Error ", err);
      });
  }
  render() {
    if (this.state.roles)
      return (
        <BrowserRouter>
          <div className="container">
            <Navbar />
            <Switch>
              <Route path="/active/:token" component={ActivationPage} />
              <Route
                exact
                path="/"
                render={(props) => <Home {...props} roles={this.state.roles} />}
              />
              <Route
                path="/signin"
                render={(props) => {
                  if (this.state.user != null) return <Redirect to="/" />;
                  else return <SignIn />;
                }}
              />
              <Route
                path="/signup"
                render={(props) => {
                  if (this.state.user != null) return <Redirect to="/" />;
                  else return <SignUp roles={this.state.roles} />;
                }}
              />

              <Route
                path="/addemployee"
                render={(props) => {
                  if (this.state.user == null) return <Redirect to="/" />;
                  else return <UserList />;
                }}
              />

              <Route
                path="/admin"
                render={(props) => {
                  if (this.state.user != null && this.state.user.isAdmin)
                    return <AdminUserlist />;
                  else return <Redirect to="/" />;
                }}
              />
            </Switch>
          </div>
        </BrowserRouter>
      );
    else return <h1>Loading</h1>;
  }
}
export default App;
