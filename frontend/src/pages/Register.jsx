import React, { useState } from "react";

import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col
} from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";


function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
    setLoading(true);

    try {

      await API.post(
        "register/",
        formData
      );

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      const data = error.response?.data;

      if (data) {

        const messages = Object.values(data)
          .flat()
          .join(" ");

        setError(messages);

      } else {

        setError("Registration failed.");

      }

    } finally {

      setLoading(false);

    }
  };


  return (
    <Container className="mt-4 mb-5">

      <Card
        className="mx-auto shadow"
        style={{ maxWidth: "700px" }}
      >

        <Card.Body>

          <h3 className="text-center mb-4">
            EB Connect Registration
          </h3>


          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}


          {success && (
            <Alert variant="success">
              {success}
            </Alert>
          )}


          <Form onSubmit={handleSubmit}>

            <Row>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Full Name
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

              </Col>


              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Username
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

              </Col>


              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

              </Col>


              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Password
                  </Form.Label>

                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                </Form.Group>

              </Col>


              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Phone
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

              </Col>


              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Pincode
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

              </Col>


              <Col md={12}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Address
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

              </Col>


              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    City
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

              </Col>


              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    State
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

              </Col>

            </Row>


            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </Button>

          </Form>


          <div className="text-center mt-3">

            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>

          </div>

        </Card.Body>

      </Card>

    </Container>
  );
}


export default Register;