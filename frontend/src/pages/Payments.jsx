import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Badge
} from "react-bootstrap";

import API from "../services/api";
import Navbar from "../components/AppNavbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await API.get("payments/");

      setPayments(response.data);
      setError("");
    } catch (err) {
      setError("Unable to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusVariant = (status) => {
    if (status === "Success") return "success";
    if (status === "Failed") return "danger";
    if (status === "Pending") return "warning";

    return "secondary";
  };

  const filteredPayments = payments.filter((payment) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      payment.payment_reference
        ?.toLowerCase()
        .includes(searchText) ||
      payment.bill_number
        ?.toLowerCase()
        .includes(searchText) ||
      payment.customer_name
        ?.toLowerCase()
        .includes(searchText);

    const matchesMethod =
      methodFilter === "All" ||
      payment.payment_method === methodFilter;

    const matchesStatus =
      statusFilter === "All" ||
      payment.status === statusFilter;

    return (
      matchesSearch &&
      matchesMethod &&
      matchesStatus
    );
  });

  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Container fluid className="p-0">

            <div className="mb-4">
              <h2>Payments</h2>

              <p className="text-muted">
                View payment history
              </p>
            </div>

            {error && (
              <ErrorMessage message={error} />
            )}

            <Card className="mb-4 shadow-sm">
              <Card.Body>

                <Row className="g-3">

                  <Col md={5}>
                    <Form.Control
                      type="text"
                      placeholder="Search payment, bill or customer..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </Col>

                  <Col md={3}>
                    <Form.Select
                      value={methodFilter}
                      onChange={(e) =>
                        setMethodFilter(e.target.value)
                      }
                    >
                      <option value="All">
                        All Payment Methods
                      </option>

                      <option value="UPI">
                        UPI
                      </option>

                      <option value="Card">
                        Card
                      </option>

                      <option value="Net Banking">
                        Net Banking
                      </option>

                      <option value="Cash">
                        Cash
                      </option>
                    </Form.Select>
                  </Col>

                  <Col md={2}>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value)
                      }
                    >
                      <option value="All">
                        All Status
                      </option>

                      <option value="Success">
                        Success
                      </option>

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Failed">
                        Failed
                      </option>
                    </Form.Select>
                  </Col>

                  <Col md={2}>
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={() => {
                        setSearch("");
                        setMethodFilter("All");
                        setStatusFilter("All");
                      }}
                    >
                      Clear
                    </Button>
                  </Col>

                </Row>

              </Card.Body>
            </Card>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <Card className="shadow-sm">

                <Card.Body>

                  <div className="mb-3">
                    <strong>
                      {filteredPayments.length}
                    </strong>{" "}
                    payment(s) found
                  </div>

                  <Table
                    responsive
                    striped
                    bordered
                    hover
                    className="align-middle"
                  >

                    <thead>
                      <tr>
                        <th>Payment Reference</th>
                        <th>Bill Number</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Payment Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center"
                          >
                            No payments found.
                          </td>
                        </tr>
                      ) : (
                        filteredPayments.map((payment) => (

                          <tr key={payment.id}>

                            <td>
                              {payment.payment_reference}
                            </td>

                            <td>
                              {payment.bill_number}
                            </td>

                            <td>
                              {payment.customer_name}
                            </td>

                            <td>
                              ₹{payment.amount}
                            </td>

                            <td>
                              {payment.payment_method}
                            </td>

                            <td>
                              {payment.payment_date
                                ? new Date(
                                  payment.payment_date
                                ).toLocaleString()
                                : "-"}
                            </td>

                            <td>
                              <Badge
                                bg={getStatusVariant(
                                  payment.status
                                )}
                              >
                                {payment.status}
                              </Badge>
                            </td>

                          </tr>

                        ))
                      )}

                    </tbody>

                  </Table>

                </Card.Body>

              </Card>
            )}

          </Container>
        </main>
      </div>
    </>
  );
}

export default Payments;