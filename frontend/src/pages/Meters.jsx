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


function Meters() {

  const [meters, setMeters] = useState([]);
  const [filteredMeters, setFilteredMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");


  useEffect(() => {
    loadMeters();
  }, []);


  useEffect(() => {
    filterMeters();
  }, [search, statusFilter, meters]);


  const loadMeters = async () => {
    try {

      const response = await API.get(
        "meters/"
      );

      setMeters(response.data);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load meter information."
      );

    } finally {

      setLoading(false);

    }
  };


  const filterMeters = () => {

    let result = [...meters];

    // Search filter
    if (search.trim() !== "") {

      const searchText =
        search.toLowerCase().trim();

      result = result.filter((meter) => {

        return (

          meter.meter_number
            ?.toLowerCase()
            .includes(searchText)

          ||

          meter.connection_number
            ?.toLowerCase()
            .includes(searchText)

          ||

          meter.customer_name
            ?.toLowerCase()
            .includes(searchText)

          ||

          meter.meter_type
            ?.toLowerCase()
            .includes(searchText)

        );

      });

    }


    // Status filter

    if (statusFilter !== "All") {

      result = result.filter(
        (meter) =>
          meter.status === statusFilter
      );

    }


    setFilteredMeters(result);

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

      case "Faulty":
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
                  Electricity Meters
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
                            Search Meters
                          </Form.Label>

                          <Form.Control
                            type="text"
                            placeholder="Search meter number, connection, customer or meter type"
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

                            <option value="Faulty">
                              Faulty
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
                  filteredMeters.length === 0 && (

                    <Alert variant="info">
                      No meters found.
                    </Alert>

                  )}


                {!loading &&
                  filteredMeters.length > 0 && (

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
                                  Meter Number
                                </th>

                                <th>
                                  Connection
                                </th>

                                <th>
                                  Customer
                                </th>

                                <th>
                                  Meter Type
                                </th>

                                <th>
                                  Initial Reading
                                </th>

                                <th>
                                  Current Reading
                                </th>

                                <th>
                                  Installation Date
                                </th>

                                <th>
                                  Status
                                </th>

                              </tr>

                            </thead>


                            <tbody>

                              {filteredMeters.map(
                                (meter, index) => (

                                  <tr key={meter.id}>

                                    <td>
                                      {index + 1}
                                    </td>

                                    <td>
                                      {meter.meter_number}
                                    </td>

                                    <td>
                                      {meter.connection_number}
                                    </td>

                                    <td>
                                      {meter.customer_name}
                                    </td>

                                    <td>
                                      {meter.meter_type}
                                    </td>

                                    <td>
                                      {meter.initial_reading}
                                    </td>

                                    <td>
                                      {meter.current_reading}
                                    </td>

                                    <td>
                                      {meter.installation_date}
                                    </td>

                                    <td>

                                      <Badge
                                        bg={getStatusVariant(
                                          meter.status
                                        )}
                                      >
                                        {meter.status}
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
                            {filteredMeters.length}{" "}
                            of{" "}
                            {meters.length}{" "}
                            meters

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
      </div>
    </>
  );
}


export default Meters;