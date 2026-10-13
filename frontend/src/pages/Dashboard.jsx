
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert
} from "react-bootstrap";

import AppNavbar from "../components/AppNavbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import API from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await API.get("dashboard/");
        setData(response.data);
      } catch (error) {
        console.error(error);
        setError("Unable to load dashboard information.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const StatCard = ({ title, value }) => (
    <Card className="dashboard-card h-100">
      <Card.Body>
        <h6 className="dashboard-stat-label">{title}</h6>
        <h2 className="dashboard-stat-value">{value ?? 0}</h2>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <AppNavbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Container fluid className="p-0">
            <h2 className="page-title">Dashboard</h2>

            <p className="page-subtitle">
              Welcome to EB Connect
            </p>

            {loading && <LoadingSpinner />}

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {data && !loading && !error && (
              <>
                {data.role === "Customer" && (
                  <>
                    <h5 className="section-title">
                      Customer Dashboard
                    </h5>

                    <Row className="g-3 g-xl-4 mb-4">
                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Applications"
                          value={data.applications}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Connections"
                          value={data.connections}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Meters"
                          value={data.meters}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Unpaid Bills"
                          value={data.unpaid_bills}
                        />
                      </Col>
                    </Row>

                    <Card className="dashboard-card">
                      <Card.Body>
                        <h6 className="dashboard-stat-label">
                          Total Amount Paid
                        </h6>
                        <h3 className="dashboard-stat-value">
                          ₹{data.total_paid ?? 0}
                        </h3>
                      </Card.Body>
                    </Card>
                  </>
                )}

                {data.role === "Admin" && (
                  <>
                    <h5 className="section-title">
                      Admin Dashboard
                    </h5>

                    <Row className="g-3 g-xl-4">
                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Customers"
                          value={data.customers}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Applications"
                          value={data.applications}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Pending Applications"
                          value={data.pending_applications}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Approved Applications"
                          value={data.approved_applications}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Connections"
                          value={data.connections}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Meters"
                          value={data.meters}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Paid Bills"
                          value={data.paid_bills}
                        />
                      </Col>

                      <Col xs={12} sm={6} xl={3}>
                        <StatCard
                          title="Unpaid Bills"
                          value={data.unpaid_bills}
                        />
                      </Col>
                    </Row>
                  </>
                )}
              </>
            )}
          </Container>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
