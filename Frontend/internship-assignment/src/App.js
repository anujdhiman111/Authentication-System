import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import UpdateInfo from "./Components/UpdateInfo";
import AllUsers from "./Components/AllUsers";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/updateInfo" element={<UpdateInfo />} />
        <Route path="/allUsers" element={<AllUsers />} />
      </Routes>
    </Router>
  );
};

export default App;
