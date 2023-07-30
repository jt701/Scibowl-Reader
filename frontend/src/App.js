import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from "./pages/HomePage";
import SinglePlayer from "./pages/SinglePlayer"
import NavBar from "./components/NavBar";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";



function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/singleplayer" element = {<SinglePlayer />} />
        <Route path="/" element = {<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
