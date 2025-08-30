import React, { useEffect, useState } from "react";
import "./MyOrder.css";

function MyOrder() {
  const [groupedOrders, setGroupedOrders] = useState({});

  useEffect(() => {
    const currentUserEmail = localStorage.getItem("email");
    if (!currentUserEmail) return;

    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const userOrders = storedOrders.filter(order => order.email === currentUserEmail);

    // Group orders by date
    const grouped = userOrders.reduce((acc, order) => {
      const date = order.date || "Unknown Date";
      if (!acc[date]) acc[date] = [];
      acc[date].push(order);
      return acc;
    }, {});

    setGroupedOrders(grouped);
  }, []);

  const orderDates = Object.keys(groupedOrders).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="my-order-container">
      <h2>My Orders</h2>
      {orderDates.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orderDates.map((date) => (
          <div key={date} className="order-group">
            <h3 className="order-date">📅 Order Date: {date}</h3>
            <div className="order-list">
              {groupedOrders[date].map((order, index) => (
                <div key={index} className="order-card">
                  <img
                    src={order.image}
                    alt={order.name}
                    className="order-image"
                  />
                  <div className="order-info">
                    <h4>{order.name}</h4>
                    <p><strong>Price:</strong> ₹{order.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrder;
