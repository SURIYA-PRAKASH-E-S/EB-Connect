import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert
} from "react-bootstrap";

import AppNavbar from "../components/AppNavbar";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function ApplyConnection() {
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    customer: "",
    application_number: "",
    connection_type: "Domestic",
    requested_load: "",
    address: "",
    status: "Pending"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await API.get("customers/");
      setCustomers(response.data);
    } catch (error) {
      setError("Unable to load customers.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await API.post("applications/", {
        application_number: formData.application_number,
        connection_type: formData.connection_type,
        requested_load: formData.requested_load,
        address: formData.address,
        status: "Pending"
      });

      setMessage("Electricity connection application submitted successfully.");

      setFormData({
        customer: "",
        application_number: "",
        connection_type: "Domestic",
        requested_load: "",
        address: "",
        status: "Pending"
      });
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        setError(
          "Unable to submit application. Please check all fields."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };

  return (
    <>
      <AppNavbar />
      <div className="app-layout">
        <Sidebar />
        <Container fluid className="p-0 main-content">
          <Row>
            <Col md={9} lg={10}>
              <div className="p-4  form-container">
                <h3>Apply for Electricity Connection</h3>
                {message && (
                  <Alert variant="success">
                    {message}
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger">
                    {error}
                  </Alert>
                )}

                <Card className="shadow-sm mt-4">
                  <Card.Body>

                    <Form onSubmit={handleSubmit}>

                      {/* Customer */}

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Customer
                        </Form.Label>

                        <Form.Select
                          name="customer"
                          value={formData.customer}
                          onChange={handleChange}
                          required
                        >
                          <option value="">
                            Select Customer
                          </option>

                          {customers.map((customer) => (
                            <option
                              key={customer.id}
                              value={customer.id}
                            >
                              {customer.name} - {customer.email}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>


                      {/* Application Number */}

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Application Number
                        </Form.Label>

                        <Form.Control
                          type="text"
                          name="application_number"
                          placeholder="Example: APP-1001"
                          value={formData.application_number}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>


                      {/* Connection Type */}

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Connection Type
                        </Form.Label>

                        <Form.Select
                          name="connection_type"
                          value={formData.connection_type}
                          onChange={handleChange}
                        >
                          <option value="Domestic">
                            Domestic
                          </option>

                          <option value="Commercial">
                            Commercial
                          </option>
                        </Form.Select>
                      </Form.Group>


                      {/* Requested Load */}

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Requested Load (KW)
                        </Form.Label>

                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          name="requested_load"
                          placeholder="Example: 5"
                          value={formData.requested_load}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>


                      {/* Address */}

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Connection Address
                        </Form.Label>

                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          placeholder="Enter connection address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>


                      <Button
                        variant="primary"
                        type="submit"
                      >
                        Submit Application
                      </Button>

                    </Form>

                  </Card.Body>
                </Card>
              </div>
            </Col>
            <Col md={3} lg={2}> </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default ApplyConnection;