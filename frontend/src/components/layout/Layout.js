import React, { useState } from 'react';
import { Container, Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiMenu,
  FiHome,
  FiCalendar,
  FiMap,
  FiUsers,
  FiBookmark,
  FiLogIn,
  FiLogOut,
  FiUser,
} from 'react-icons/fi';
import WeatherBadge from '../ui/WeatherBadge';
import { useAuth } from '../../context/AuthContext';

const navigationItems = [
  { name: 'Home', path: '/', icon: FiHome },
  { name: 'Plan Trip', path: '/planner', icon: FiCalendar },
  { name: 'Saved Trips', path: '/saved', icon: FiBookmark },
];

const Layout = ({ children }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Nav.Link as={Link} to={item.path} active={isActive}>
        <item.icon /> {item.name}
      </Nav.Link>
    );
  };

  return (
    <>
      <Navbar bg="light" expand="md" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <FiMap /> TourPlanner
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={handleShow}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {navigationItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Link disabled style={{ color: '#666' }}>
                    <FiUser /> {user?.name}
                  </Nav.Link>
                  <Nav.Link as={Link} to="/saved">
                    <FiBookmark /> Saved
                  </Nav.Link>
                  <Nav.Link
                    onClick={handleLogout}
                    style={{ cursor: 'pointer' }}
                  >
                    <FiLogOut /> Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <FiLogIn /> Login
                </Nav.Link>
              )}
            </Nav>
            <WeatherBadge />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Navigation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navigationItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
            {isAuthenticated ? (
              <>
                <Nav.Link disabled style={{ color: '#666', marginTop: '1rem' }}>
                  <FiUser /> {user?.name}
                </Nav.Link>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <FiLogOut /> Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" onClick={handleClose}>
                <FiLogIn /> Login
              </Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <main>{children}</main>
    </>
  );
};

export default Layout;
