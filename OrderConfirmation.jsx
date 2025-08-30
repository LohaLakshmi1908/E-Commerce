import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function OrderConfirmation() {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem("orderDetails")) || {};

  const {
    email = "",
    payment = "",
    upiId = "",
    deliveryDetails = {},
    orderedItems = [],
  } = order;

  const {
    name = "",
    address = "",
    locality = "",
    city = "",
    state = "",
    pincode = "",
    phone = "",
  } = deliveryDetails;

  return (
    <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} style={{ padding: "2rem", maxWidth: "900px", width: "100%" }}>
        <Typography variant="h4" gutterBottom align="center">
          Order Confirmed!
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center">
          Thank you for your purchase, <strong>{name}</strong>!
        </Typography>

        <div style={{ display: "flex", marginTop: "2rem", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom><strong>Delivery Address</strong></Typography>
            <Typography>{name}</Typography>
            <Typography>{address}{locality && `, ${locality}`}</Typography>
            <Typography>{city}, {state} - {pincode}</Typography>
            <Typography>Phone: {phone}</Typography>

            {/* Payment Info */}
            <div style={{ marginTop: "1.5rem" }}>
              <Typography><strong>Payment Method:</strong> {payment}</Typography>
              {payment === "UPI" && upiId && (
                <Typography><strong>UPI ID:</strong> {upiId}</Typography>
              )}
            </div>
          </div>

          {/* Product Images */}
          <div style={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>Ordered Items</Typography>
            {orderedItems.length === 0 ? (
              <Typography>No items found.</Typography>
            ) : (
              orderedItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    gap: "1rem",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "contain",
                    }}
                  />
                  <div>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2">Qty: {item.quantity}</Typography>
                    <Typography variant="body2">₹{(item.unitPrice || item.price) * item.quantity}</Typography>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Continue Shopping */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          style={{ marginTop: "1rem"}}
        >
          Continue Shopping
        </Button>
      </Paper>
    </div>
  );
}

export default OrderConfirmation;
