import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Upload", path: "/upload" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">FaceFilter</div>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
