import React, { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Badge,
  Alert
} from "react-bootstrap";

import AppNavbar from "../components/AppNavbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";

import API from "../services/api";


function Connections() {

  const [connections, setConnections] = useState([]);

  const [filteredConnections, setFilteredConnections] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");


  useEffect(() => {
    loadConnections();
  }, []);


  useEffect(() => {
    filterConnections();
  }, [search, statusFilter, connections]);


  const loadConnections = async () => {

    try {

      const response = await API.get(
        "connections/"
      );

      setConnections(response.data);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load connections."
      );

    } finally {

      setLoading(false);

    }
  };


  const filterConnections = () => {

    let result = [...connections];


    // Search

    if (search.trim() !== "") {

      const searchText =
        search.toLowerCase().trim();

      result = result.filter((connection) => {

        return (

          connection.connection_number
            ?.toLowerCase()
            .includes(searchText)

          ||

          connection.customer_name
            ?.toLowerCase()
            .includes(searchText)

          ||

          connection.meter_number
            ?.toLowerCase()
            .includes(searchText)

        );

      });

    }


    // Status filter

    if (statusFilter !== "All") {

      result = result.filter(
        (connection) =>
          connection.status === statusFilter
      );

    }


    setFilteredConnections(result);

  };


  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");

  };


  const getStatusVariant = (status) => {

    switch (status) {

      case "Active":
        return "success";

      case "Inactive":
        return "warning";

      case "Disconnected":
        return "danger";

      default:
        return "secondary";

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

            <div className="p-4">

              <h3 className="mb-4">
                Electricity Connections
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

                  <Row>

                    <Col md={7}>

                      <Form.Group>

                        <Form.Label>
                          Search Connections
                        </Form.Label>

                        <Form.Control
                          type="text"
                          placeholder="Search connection number, customer or meter number"
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

                          <option value="Active">
                            Active
                          </option>

                          <option value="Inactive">
                            Inactive
                          </option>

                          <option value="Disconnected">
                            Disconnected
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


              {!loading &&
                filteredConnections.length === 0 && (

                  <Alert variant="info">
                    No connections found.
                  </Alert>

                )}


              {!loading &&
                filteredConnections.length > 0 && (

                  <Card className="shadow-sm">

                    <Card.Body>

                      <div className="table-responsive">

                        <Table
                          striped
                          bordered
                          hover
                        >

                          <thead>

                            <tr>

                              <th>
                                #
                              </th>

                              <th>
                                Connection Number
                              </th>

                              <th>
                                Customer
                              </th>

                              <th>
                                Type
                              </th>

                              <th>
                                Meter Number
                              </th>

                              <th>
                                Load
                              </th>

                              <th>
                                Connection Date
                              </th>

                              <th>
                                Status
                              </th>

                            </tr>

                          </thead>


                          <tbody>

                            {filteredConnections.map(
                              (connection, index) => (

                                <tr key={connection.id}>

                                  <td>
                                    {index + 1}
                                  </td>

                                  <td>
                                    {connection.connection_number}
                                  </td>

                                  <td>
                                    {connection.customer_name}
                                  </td>

                                  <td>
                                    {connection.connection_type}
                                  </td>

                                  <td>
                                    {connection.meter_number}
                                  </td>

                                  <td>
                                    {connection.load}
                                  </td>

                                  <td>
                                    {connection.connection_date}
                                  </td>

                                  <td>

                                    <Badge
                                      bg={getStatusVariant(
                                        connection.status
                                      )}
                                    >
                                      {connection.status}
                                    </Badge>

                                  </td>

                                </tr>

                              )
                            )}

                          </tbody>

                        </Table>

                      </div>


                      <div className="mt-2">

                        <small className="text-muted">

                          Showing{" "}
                          {filteredConnections.length}{" "}
                          of{" "}
                          {connections.length}{" "}
                          connections

                        </small>

                      </div>

                    </Card.Body>

                  </Card>

                )}

            </div>

          </Col>
          <Col md={3} lg={2}></Col>
        </Row>
      </Container>
      </div>
    </>
  );
}


export default Connections;