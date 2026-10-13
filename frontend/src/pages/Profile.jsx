import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  Button
} from "react-bootstrap";

import AppNavbar from "../components/AppNavbar";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Profile() {

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    loadCustomer();
  }, []);


  const loadCustomer = async () => {

    try {

      const response = await API.get("customers/");
      if (response.data.length > 0) {
        setCustomer(response.data[0]);

      } else {
        setError("Customer profile not found.");

      }

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load customer information."
      );

    } finally {

      setLoading(false);

    }
  };


  const handleChange = (e) => {

    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    });

  };


  const handleUpdate = async (e) => {

    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");


    try {

      const response = await API.put(
        `customers/${customer.id}/`,
        {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode
        }
      );


      setCustomer(response.data);

      setSuccess(
        "Profile updated successfully."
      );

      setEditMode(false);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }
  };


  return (
    <>
      <AppNavbar />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Container fluid className="p-0">
            <Row>
              <Col md={9} lg={10}>
                <div className="p-4">
                  <h3>My Profile</h3>


                  {loading && (
                    <div className="text-center mt-4">
                      <Spinner animation="border" />
                    </div>

                  )}


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


                  {customer && (

                    <Card className="shadow-sm mt-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5>
                            {customer.name}
                          </h5>
                          {!editMode && (

                            <Button
                              variant="primary"
                              onClick={() => setEditMode(true)}
                            >
                              Edit Profile
                            </Button>

                          )}

                        </div>
                        <hr />

                        {editMode ? (

                          <Form onSubmit={handleUpdate}>

                            <Form.Group className="mb-3">

                              <Form.Label>
                                Name
                              </Form.Label>

                              <Form.Control
                                type="text"
                                name="name"
                                value={customer.name}
                                onChange={handleChange}
                                required
                              />

                            </Form.Group>


                            <Form.Group className="mb-3">

                              <Form.Label>
                                Email
                              </Form.Label>

                              <Form.Control
                                type="email"
                                name="email"
                                value={customer.email}
                                onChange={handleChange}
                                required
                              />

                            </Form.Group>


                            <Form.Group className="mb-3">

                              <Form.Label>
                                Phone
                              </Form.Label>

                              <Form.Control
                                type="text"
                                name="phone"
                                value={customer.phone}
                                onChange={handleChange}
                                required
                              />

                            </Form.Group>


                            <Form.Group className="mb-3">

                              <Form.Label>
                                Address
                              </Form.Label>

                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="address"
                                value={customer.address}
                                onChange={handleChange}
                                required
                              />

                            </Form.Group>


                            <Row>

                              <Col md={4}>

                                <Form.Group className="mb-3">

                                  <Form.Label>
                                    City
                                  </Form.Label>

                                  <Form.Control
                                    type="text"
                                    name="city"
                                    value={customer.city}
                                    onChange={handleChange}
                                    required
                                  />

                                </Form.Group>

                              </Col>


                              <Col md={4}>

                                <Form.Group className="mb-3">

                                  <Form.Label>
                                    State
                                  </Form.Label>

                                  <Form.Control
                                    type="text"
                                    name="state"
                                    value={customer.state}
                                    onChange={handleChange}
                                    required
                                  />

                                </Form.Group>

                              </Col>


                              <Col md={4}>

                                <Form.Group className="mb-3">

                                  <Form.Label>
                                    Pincode
                                  </Form.Label>

                                  <Form.Control
                                    type="text"
                                    name="pincode"
                                    value={customer.pincode}
                                    onChange={handleChange}
                                    required
                                  />

                                </Form.Group>
                              </Col>
                            </Row>


                            <Button
                              type="submit"
                              variant="success"
                              disabled={saving}
                            >
                              {saving
                                ? "Saving..."
                                : "Save Changes"}
                            </Button>


                            <Button
                              type="button"
                              variant="secondary"
                              className="ms-2"
                              onClick={() => {
                                setEditMode(false);
                                loadCustomer();
                              }}
                            >
                              Cancel
                            </Button>

                          </Form>

                        ) : (

                          <>
                            <p>
                              <strong>Email:</strong>{" "}
                              {customer.email}
                            </p>

                            <p>
                              <strong>Phone:</strong>{" "}
                              {customer.phone}
                            </p>

                            <p>
                              <strong>Address:</strong>{" "}
                              {customer.address}
                            </p>

                            <p>
                              <strong>City:</strong>{" "}
                              {customer.city}
                            </p>

                            <p>
                              <strong>State:</strong>{" "}
                              {customer.state}
                            </p>

                            <p>
                              <strong>Pincode:</strong>{" "}
                              {customer.pincode}
                            </p>

                            <p>
                              <strong>Role:</strong>{" "}
                              {customer.role}
                            </p>
                          </>

                        )}

                      </Card.Body>
                    </Card>

                  )}
                </div>
              </Col>
              <Col md={3} lg={2}>

              </Col>

            </Row>
          </Container>
        </main>
      </div>
    </>
  );
}

export default Profile;