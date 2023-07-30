import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav} from 'react-bootstrap';
import '../css/NavBar.css'; 

const NavBar = () => {
    return (
        <Navbar expand="lg" bg="dark" variant={"dark"}>
          <Container >
            <Navbar.Brand as={Link} to="/">Scibowl Practice</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/singleplayer">Single Player</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
};

export default NavBar;