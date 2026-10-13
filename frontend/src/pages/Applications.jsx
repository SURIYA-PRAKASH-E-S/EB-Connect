import React, { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Badge,
  Alert
} from "react-bootstrap";

import AppNavbar from "../components/AppNavbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";

import API from "../services/api";


function Applications() {

  const [applications, setApplications] = useState([]);

  const [filteredApplications, setFilteredApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");


  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isAdmin = user?.role === "Admin";


  useEffect(() => {

    loadApplications();

  }, []);


  useEffect(() => {

    filterApplications();

  }, [search, statusFilter, applications]);


  const loadApplications = async () => {

    try {

      const response = await API.get(
        "applications/"
      );

      setApplications(response.data);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load applications."
      );

    } finally {

      setLoading(false);

    }
  };


  const filterApplications = () => {

    let result = [...applications];


    // Search filter

    if (search.trim() !== "") {

      const searchText =
        search.toLowerCase().trim();

      result = result.filter((application) => {

        return (

          application.application_number
            ?.toLowerCase()
            .includes(searchText)

          ||

          application.customer_name
            ?.toLowerCase()
            .includes(searchText)

          ||

          application.customer_email
            ?.toLowerCase()
            .includes(searchText)

        );

      });

    }


    // Status filter

    if (statusFilter !== "All") {

      result = result.filter(
        (application) =>
          application.status === statusFilter
      );

    }


    setFilteredApplications(result);

  };


  const reviewApplication = async (
    id,
    newStatus
  ) => {

    try {

      await API.patch(
        `applications/${id}/review/`,
        {
          status: newStatus
        }
      );

      loadApplications();

    } catch (error) {

      console.error(error);

      setError(
        "Unable to update application status."
      );

    }
  };


  const createConnection = async (id) => {

    try {

      await API.post(
        `applications/${id}/create-connection/`
      );

      alert(
        "Connection created successfully."
      );

      loadApplications();

    } catch (error) {

      console.error(error);

      const message =
        error.response?.data?.error ||
        "Unable to create connection.";

      setError(message);

    }
  };


  const deleteApplication = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
      return;
    }


    try {

      await API.delete(
        `applications/${id}/`
      );

      loadApplications();

    } catch (error) {

      console.error(error);

      setError(
        "Unable to delete application."
      );

    }
  };


  const getStatusVariant = (status) => {

    switch (status) {

      case "Pending":
        return "warning";

      case "Under Review":
        return "info";

      case "Approved":
        return "success";

      case "Rejected":
        return "danger";

      default:
        return "secondary";

    }
  };


  const clearFilters = () => {

    setSearch("");

    setStatusFilter("All");

  };


  return (
    <>
      <AppNavbar />

      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Container fluid>

            <Row>
              <Col md={9} lg={10}>
                <div className="p-4">
                  <h3 className="mb-4">
                    Connection Applications
                  </h3>


                  {error && (

                    <Alert
                      variant="danger"
                      dismissible
                      onClose={() => setError("")}
                    >
                      {error}
                    </Alert>

                  )}


                  {/* Search and Filter */}

                  <Card className="shadow-sm mb-4">

                    <Card.Body>

                      <Row className="g-3">

                        <Col md={7}>

                          <Form.Group>

                            <Form.Label>
                              Search Applications
                            </Form.Label>

                            <Form.Control
                              type="text"
                              placeholder="Search application number, customer name or email"
                              value={search}
                              onChange={(e) =>
                                setSearch(e.target.value)
                              }
                            />

                          </Form.Group>

                        </Col>


                        <Col md={3}>

                          <Form.Group>

                            <Form.Label>
                              Status
                            </Form.Label>

                            <Form.Select
                              value={statusFilter}
                              onChange={(e) =>
                                setStatusFilter(e.target.value)
                              }
                            >

                              <option value="All">
                                All
                              </option>

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="Under Review">
                                Under Review
                              </option>

                              <option value="Approved">
                                Approved
                              </option>

                              <option value="Rejected">
                                Rejected
                              </option>

                            </Form.Select>

                          </Form.Group>

                        </Col>


                        <Col
                          md={2}
                          className="d-flex align-items-end"
                        >

                          <Button
                            variant="secondary"
                            className="w-100"
                            onClick={clearFilters}
                          >
                            Clear
                          </Button>

                        </Col>

                      </Row>

                    </Card.Body>

                  </Card>


                  {loading && (
                    <LoadingSpinner />
                  )}


                  {!loading && filteredApplications.length === 0 && (

                    <Alert variant="info">

                      No applications found.

                    </Alert>

                  )}


                  {!loading &&
                    filteredApplications.length > 0 && (

                      <Card className="table-container">
                        <Card.Body>
                          <div className="table-responsive">
                            <Table responsive hover>
                              <thead>
                                <tr>
                                  <th>
                                    #
                                  </th>
                                  <th>
                                    Application Number
                                  </th>
                                  <th>
                                    Customer
                                  </th>

                                  <th>
                                    Email
                                  </th>

                                  <th>
                                    Type
                                  </th>

                                  <th>
                                    Load
                                  </th>

                                  <th>
                                    Status
                                  </th>

                                  {isAdmin && (
                                    <th>
                                      Actions
                                    </th>
                                  )}
                                </tr>
                              </thead>


                              <tbody>

                                {filteredApplications.map(
                                  (application, index) => (

                                    <tr key={application.id}>

                                      <td>
                                        {index + 1}
                                      </td>

                                      <td>
                                        {application.application_number}
                                      </td>

                                      <td>
                                        {application.customer_name}
                                      </td>

                                      <td>
                                        {application.customer_email}
                                      </td>

                                      <td>
                                        {application.connection_type}
                                      </td>

                                      <td>
                                        {application.requested_load}
                                      </td>

                                      <td>

                                        <Badge
                                          bg={getStatusVariant(
                                            application.status
                                          )}
                                        >
                                          {application.status}
                                        </Badge>

                                      </td>


                                      {isAdmin && (

                                        <td>

                                          {application.status ===
                                            "Pending" && (

                                              <Button
                                                size="sm"
                                                variant="info"
                                                className="me-1 mb-1"
                                                onClick={() =>
                                                  reviewApplication(
                                                    application.id,
                                                    "Under Review"
                                                  )
                                                }
                                              >
                                                Review
                                              </Button>

                                            )}


                                          {(application.status ===
                                            "Pending" ||
                                            application.status ===
                                            "Under Review") && (

                                              <>
                                                <Button
                                                  size="sm"
                                                  variant="success"
                                                  className="me-1 mb-1"
                                                  onClick={() =>
                                                    reviewApplication(
                                                      application.id,
                                                      "Approved"
                                                    )
                                                  }
                                                >
                                                  Approve
                                                </Button>


                                                <Button
                                                  size="sm"
                                                  variant="danger"
                                                  className="me-1 mb-1"
                                                  onClick={() =>
                                                    reviewApplication(
                                                      application.id,
                                                      "Rejected"
                                                    )
                                                  }
                                                >
                                                  Reject
                                                </Button>
                                              </>

                                            )}


                                          {application.status ===
                                            "Approved" && (

                                              <Button
                                                size="sm"
                                                variant="primary"
                                                className="me-1 mb-1"
                                                onClick={() =>
                                                  createConnection(
                                                    application.id
                                                  )
                                                }
                                              >
                                                Create Connection
                                              </Button>

                                            )}


                                          <Button
                                            size="sm"
                                            variant="outline-danger"
                                            className="mb-1"
                                            onClick={() =>
                                              deleteApplication(
                                                application.id
                                              )
                                            }
                                          >
                                            Delete
                                          </Button>

                                        </td>

                                      )}

                                    </tr>

                                  )
                                )}

                              </tbody>
                            </Table>
                          </div>


                          <div className="mt-2">
                            <small className="text-muted">
                              Showing{" "}
                              {filteredApplications.length}{" "}
                              of{" "}
                              {applications.length}{" "}
                              applications

                            </small>
                          </div>
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


export default Applications;