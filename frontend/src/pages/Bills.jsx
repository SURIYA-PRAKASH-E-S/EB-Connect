import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Alert,
  Badge
} from "react-bootstrap";

import API from "../services/api";
import Navbar from "../components/AppNavbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function Bills() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "Admin";

  const [bills, setBills] = useState([]);
  const [connections, setConnections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    connection: "",
    bill_number: "",
    billing_month: "",
    previous_reading: "",
    current_reading: "",
    amount: "",
    due_date: "",
    status: "Unpaid"
  });

  const fetchBills = async () => {
    try {
      setLoading(true);

      const response = await API.get("bills/");
      setBills(response.data);

      setError("");
    } catch (err) {
      setError("Unable to load bills.");
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await API.get("connections/");
      setConnections(response.data);
    } catch (err) {
      setError("Unable to load connections.");
    }
  };

  useEffect(() => {
    fetchBills();

    if (isAdmin) {
      fetchConnections();
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const unitsConsumed =
    formData.previous_reading !== "" &&
      formData.current_reading !== ""
      ? Number(formData.current_reading) -
      Number(formData.previous_reading)
      : 0;

  const handleCreateBill = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (unitsConsumed < 0) {
      setError(
        "Current reading cannot be less than previous reading."
      );
      return;
    }

    try {
      await API.post("bills/", {
        connection: Number(formData.connection),
        bill_number: formData.bill_number,
        billing_month: formData.billing_month,
        previous_reading: Number(formData.previous_reading),
        current_reading: Number(formData.current_reading),
        units_consumed: unitsConsumed,
        amount: Number(formData.amount),
        due_date: formData.due_date,
        status: "Unpaid"
      });

      setSuccess("Bill created successfully.");

      setFormData({
        connection: "",
        bill_number: "",
        billing_month: "",
        previous_reading: "",
        current_reading: "",
        amount: "",
        due_date: "",
        status: "Unpaid"
      });

      setShowForm(false);

      fetchBills();
    } catch (err) {
      const message =
        err.response?.data?.bill_number?.[0] ||
        err.response?.data?.detail ||
        "Unable to create bill.";

      setError(message);
    }
  };

  const handlePayment = async (bill) => {
    try {
      setError("");
      setSuccess("");

      await API.post("payments/", {
        bill: bill.id,
        payment_reference: `PAY-${Date.now()}`,
        amount: bill.amount,
        payment_method: "UPI"
      });

      setSuccess("Payment completed successfully.");

      fetchBills();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Payment failed."
      );
    }
  };

  const getStatusVariant = (status) => {
    if (status === "Paid") return "success";
    if (status === "Unpaid") return "warning";
    if (status === "Overdue") return "danger";

    return "secondary";
  };

  const filteredBills = bills.filter((bill) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      bill.bill_number?.toLowerCase().includes(searchText) ||
      bill.customer_name?.toLowerCase().includes(searchText) ||
      bill.connection_number?.toLowerCase().includes(searchText) ||
      bill.billing_month?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Container fluid className="p-0">

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2>Bills</h2>
                <p className="text-muted">
                  Manage electricity bills
                </p>
              </div>

              {isAdmin && (
                <Button
                  variant="primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? "Close Form" : "+ Create Bill"}
                </Button>
              )}
            </div>

            {success && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setSuccess("")}
              >
                {success}
              </Alert>
            )}

            {error && <ErrorMessage message={error} />}

            {/* Admin Create Bill Form */}

            {isAdmin && showForm && (
              <Card className="mb-4 shadow-sm">
                <Card.Header>
                  <strong>Create New Bill</strong>
                </Card.Header>

                <Card.Body>

                  <Form onSubmit={handleCreateBill}>

                    <Row className="g-3">

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Connection
                          </Form.Label>

                          <Form.Select
                            name="connection"
                            value={formData.connection}
                            onChange={handleChange}
                            required
                          >
                            <option value="">
                              Select Connection
                            </option>

                            {connections.map((connection) => (
                              <option
                                key={connection.id}
                                value={connection.id}
                              >
                                {connection.connection_number} -
                                {" "}
                                {connection.customer_name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Bill Number
                          </Form.Label>

                          <Form.Control
                            type="text"
                            name="bill_number"
                            placeholder="BILL-1002"
                            value={formData.bill_number}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>

                    </Row>

                    <Row>

                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Billing Month
                          </Form.Label>

                          <Form.Control
                            type="text"
                            name="billing_month"
                            placeholder="November 2026"
                            value={formData.billing_month}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Previous Reading
                          </Form.Label>

                          <Form.Control
                            type="number"
                            name="previous_reading"
                            min="0"
                            value={formData.previous_reading}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Current Reading
                          </Form.Label>

                          <Form.Control
                            type="number"
                            name="current_reading"
                            min="0"
                            value={formData.current_reading}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>

                    </Row>

                    <Row>

                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Units Consumed
                          </Form.Label>

                          <Form.Control
                            type="number"
                            value={unitsConsumed}
                            readOnly
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Amount
                          </Form.Label>

                          <Form.Control
                            type="number"
                            name="amount"
                            min="0"
                            step="0.01"
                            placeholder="850"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Due Date
                          </Form.Label>

                          <Form.Control
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>

                    </Row>

                    <Button
                      type="submit"
                      variant="success"
                    >
                      Create Bill
                    </Button>

                  </Form>

                </Card.Body>
              </Card>
            )}

            {/* Search */}

            <Card className="mb-4 shadow-sm">
              <Card.Body>

                <Row>

                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Search bill, customer, connection..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </Col>

                  <Col md={3}>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value)
                      }
                    >
                      <option value="All">
                        All Status
                      </option>

                      <option value="Paid">
                        Paid
                      </option>

                      <option value="Unpaid">
                        Unpaid
                      </option>

                      <option value="Overdue">
                        Overdue
                      </option>
                    </Form.Select>
                  </Col>

                  <Col md={3}>
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Col>

                </Row>

              </Card.Body>
            </Card>

            {/* Bills Table */}

            {loading ? (
              <LoadingSpinner />
            ) : (
              <Card className="shadow-sm">

                <Card.Body>

                  <div className="mb-3">
                    <strong>
                      {filteredBills.length}
                    </strong>{" "}
                    bill(s) found
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
                        <th>Bill No</th>
                        <th>Customer</th>
                        <th>Connection</th>
                        <th>Month</th>
                        <th>Previous</th>
                        <th>Current</th>
                        <th>Units</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredBills.length === 0 ? (
                        <tr>
                          <td
                            colSpan="11"
                            className="text-center"
                          >
                            No bills found.
                          </td>
                        </tr>
                      ) : (
                        filteredBills.map((bill) => (

                          <tr key={bill.id}>

                            <td>
                              {bill.bill_number}
                            </td>

                            <td>
                              {bill.customer_name}
                            </td>

                            <td>
                              {bill.connection_number}
                            </td>

                            <td>
                              {bill.billing_month}
                            </td>

                            <td>
                              {bill.previous_reading}
                            </td>

                            <td>
                              {bill.current_reading}
                            </td>

                            <td>
                              {bill.units_consumed}
                            </td>

                            <td>
                              ₹{bill.amount}
                            </td>

                            <td>
                              {bill.due_date}
                            </td>

                            <td>
                              <Badge
                                bg={getStatusVariant(
                                  bill.status
                                )}
                              >
                                {bill.status}
                              </Badge>
                            </td>

                            <td>

                              {!isAdmin &&
                                bill.status !== "Paid" && (
                                  <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() =>
                                      handlePayment(bill)
                                    }
                                  >
                                    Pay Now
                                  </Button>
                                )}

                              {bill.status === "Paid" && (
                                <span className="text-success">
                                  Paid
                                </span>
                              )}

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

export default Bills;