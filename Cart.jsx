import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function Cart({ cartItems, onRemoveFromCart }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    setCounts(cartItems.map(() => 1));
  }, [cartItems]);

  const handlePlaceOrder = () => {
    const itemsToOrder = cartItems.map((item, index) => ({
      ...item,
      quantity: counts[index],
    }));
    localStorage.setItem("orderedItems", JSON.stringify(itemsToOrder));
    navigate("/PlaceOrder");
  };

  const handleInc = (index) => {
    const updatedCounts = [...counts];
    updatedCounts[index]++;
    setCounts(updatedCounts);
  };

  const handleDec = (index) => {
    const updatedCounts = [...counts];
    if (updatedCounts[index] > 1) {
      updatedCounts[index]--;
    }
    setCounts(updatedCounts);
  };

  const handleRemove = (index) => {
    onRemoveFromCart(index);
  };

  const totalPrice = cartItems.reduce((total, item, index) => {
    return total + item.price * (counts[index]);
  }, 0);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {cartItems.map((product, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  width: "300px",
                  borderRadius: "8px",
                }}
              >
                <h2>{product.name}</h2>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "250px" }}
                />
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
                  <Button variant="outlined" onClick={() => handleDec(index)}>-</Button>
                  <p>{counts[index]}</p>
                  <Button variant="outlined" onClick={() => handleInc(index)}>+</Button>
                  <Button variant="outlined" color="error" onClick={() => handleRemove(index)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <h2>Total: ₹{totalPrice}</h2>
            <Button
              variant="contained"
              onClick={handlePlaceOrder}
              style={{
                backgroundColor: "#ff9800",
                color: "white",
                padding: "10px 40px",
                fontSize: "16px",
                borderRadius: "6px",
              }}
            >
              Place Order
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
