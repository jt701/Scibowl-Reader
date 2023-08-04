import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav} from 'react-bootstrap';
import '../css/NavBar.css'; 

const NavBar = () => {
    return (
      <Navbar expand="lg" variant={"dark"} className="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">Scibowl Practice</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link className="single-player" as={Link} to="/singleplayer">Single Player</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
)};

export default NavBar;