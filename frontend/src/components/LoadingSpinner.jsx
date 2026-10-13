import React from "react";
import { Spinner } from "react-bootstrap";

function LoadingSpinner() {

  return (
    <div className="text-center p-4">

      <Spinner animation="border" />

      <p className="mt-2">
        Loading...
      </p>

    </div>
  );
}

export default LoadingSpinner;