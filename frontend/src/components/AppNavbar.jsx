
import React from "react";
import { Navbar, Container, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const displayName =
    user?.first_name ||
    user?.username ||
    user?.name ||
    "User";

  const role = user?.role || "Customer";

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      style={{
        backgroundColor: "#001F3F",
        padding: "12px 0",
      }}
    >
      <Container fluid className="px-3 px-md-4">
        <Navbar.Brand
          as={Link}
          to="/dashboard"
          style={{
            fontWeight: "bold",
            fontSize: "clamp(19px, 3vw, 26px)",
            color: "#FFFFFF",
            letterSpacing: "0.5px",
          }}
        >
          EB Connect
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Logged-in user details */}
          <div className="text-end text-white">
            <div
              className="fw-bold"
              style={{
                fontSize: "clamp(12px, 2vw, 15px)",
                overflowWrap: "anywhere",
              }}
            >
              {displayName}
            </div>

            <Badge bg={role === "Admin" ? "warning" : "info"} text={role === "Admin" ? "dark" : undefined}>
              {role}
            </Badge>
          </div>

          {/* Logout */}
          <Button
            variant="outline-light"
            className="fw-bold"
            size="sm"
            onClick={handleLogout}
            style={{
              borderWidth: "2px",
              padding: "7px 12px",
              whiteSpace: "nowrap",
            }}
          >
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
