
import React, { useState, useEffect } from "react";
import { Nav, Button } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling while the mobile menu is open.
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("sidebar-menu-open");
    } else {
      document.body.classList.remove("sidebar-menu-open");
    }

    return () => {
      document.body.classList.remove("sidebar-menu-open");
    };
  }, [isOpen]);

  const links = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "Apply Connection", path: "/apply-connection" },
    { label: "Applications", path: "/applications" },
    { label: "Connections", path: "/connections" },
    { label: "Meters", path: "/meters" },
    { label: "Bills", path: "/bills" },
    { label: "Payments", path: "/payments" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="primary"
        className="sidebar-toggle d-lg-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="eb-sidebar"
      >
        <span className="sidebar-toggle-icon">
          {isOpen ? "\u2715" : "\u2630"}
        </span>
      </Button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar navigation */}
      <aside
        id="eb-sidebar"
        className={`sidebar bg-light ${
          isOpen ? "sidebar-open" : ""
        }`}
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <h5 className="sidebar-brand">EB Connect</h5>

          <Button
            variant="outline-secondary"
            size="sm"
            className="sidebar-close d-lg-none"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          >
            {"\u2715"}
          </Button>
        </div>

        <Nav className="flex-column sidebar-nav">
          {links.map((link) => (
            <Nav.Link
              as={NavLink}
              to={link.path}
              key={link.path}
              end
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              {link.label}
            </Nav.Link>
          ))}
        </Nav>
      </aside>
    </>
  );
}

export default Sidebar;
