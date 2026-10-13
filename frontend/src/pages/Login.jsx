import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert
} from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";


function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

      // Clear old login session
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");

    try {

      const response = await API.post(
        "login/",
        formData
      );

      localStorage.setItem(
        "access",
        response.data.access
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {

      const message =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        "Invalid username or password.";

      setError(message);

    } finally {

      setLoading(false);

    }
  };


  return (
    <Container className="mt-5">

      <Card
        className="mx-auto shadow"
        style={{ maxWidth: "450px" }}
      >

        <Card.Body>

          <h3 className="text-center mb-4">
            EB Connect Login
          </h3>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">

              <Form.Label>
                Username
              </Form.Label>

              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />

            </Form.Group>


            <Form.Group className="mb-3">

              <Form.Label>
                Password
              </Form.Label>

              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />

            </Form.Group>


            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

          </Form>


          <div className="text-center mt-3">

            <span>
              Don't have an account?{" "}
            </span>

            <Link to="/register">
              Register
            </Link>

          </div>

        </Card.Body>

      </Card>

    </Container>
  );
}


export default Login;