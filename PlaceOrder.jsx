import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import "./PlaceOrder.css";

function PlaceOrder() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [payment, setPayment] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiValid, setUpiValid] = useState(null);

  const [captcha, setCaptcha] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");

  const [orderedItems, setOrderedItems] = useState(() =>
    JSON.parse(localStorage.getItem("orderedItems")) || []
  );

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("loggedInUser");
    if (loggedInEmail) {
      setEmail(loggedInEmail);
      setIsLoggedIn(true);

      const savedDetails = JSON.parse(localStorage.getItem(`deliveryDetails_${loggedInEmail}`));
      if (savedDetails) {
        setName(savedDetails.name || "");
        setPhone(savedDetails.phone || "");
        setPincode(savedDetails.pincode || "");
        setLocality(savedDetails.locality || "");
        setAddress(savedDetails.address || "");
        setCity(savedDetails.city || "");
        setState(savedDetails.state || "");
        setIsEditingAddress(false);
      }
    }
  }, []);

  const registeredUsers = [
    { email: "aashika15@gmail.com", password: "Aashika15" },
    { email: "aashi15@gmail.com", password: "Aashi15" },
    { email: "asish13@gmail.com", password: "Asish13" },
    { email: "loha47@gmail.com", password: "loha47" },

  ];

  const handleLogin = () => {
    const user = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setIsLoggedIn(true);
      localStorage.setItem("loggedInUser", email);
      alert("Login successful!");

      const savedDetails = JSON.parse(localStorage.getItem(`deliveryDetails_${email}`));
      if (savedDetails) {
        setName(savedDetails.name || "");
        setPhone(savedDetails.phone || "");
        setPincode(savedDetails.pincode || "");
        setLocality(savedDetails.locality || "");
        setAddress(savedDetails.address || "");
        setCity(savedDetails.city || "");
        setState(savedDetails.state || "");
        setIsEditingAddress(false);
      } else {
        setIsEditingAddress(true);
      }
    } else {
      alert("Invalid email or password. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setPincode("");
    setLocality("");
    setAddress("");
    setCity("");
    setState("");
    setOrderedItems([]);
    setPayment("");
  };

  const handlePlaceOrder = () => {
    if (!email || !name || !phone || !pincode || !locality || !address || !city || !state || !payment) {
      alert("Please fill all delivery and payment fields.");
      return;
    }

    const deliveryDetails = { name, phone, pincode, locality, address, city, state };

    const fullOrder = {
      email,
      orderedItems,
      deliveryDetails,
      payment,
      upiId: payment === "UPI" ? upiId : null,
    };

    localStorage.setItem("orderDetails", JSON.stringify(fullOrder));
    localStorage.setItem(`deliveryDetails_${email}`, JSON.stringify(deliveryDetails));

    // ✅ Add user's email to each order item
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const previousOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrderItems = orderedItems.map((item) => ({
      name: item.name,
      image: item.image,
      price: (item.unitPrice || item.price) * item.quantity,
      date: currentDate,
      email:email,
    }));

    const updatedOrders = [...previousOrders, ...newOrderItems];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    alert("Order placed successfully!");
    localStorage.removeItem("orderedItems");
    navigate("/order-confirmation");
  };

  const totalAmount = orderedItems.reduce(
    (total, item) => total + (item.unitPrice || item.price) * item.quantity,
    0
  );

  const totalQuantity = orderedItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handlingFee = 50;
  const platformFee = 5;
  const totalPayable = totalAmount + handlingFee + platformFee;

  return (
    <div className="place-order-container">
      <div className="place-order-left">
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          style={{ marginBottom: "1rem", backgroundColor: "orange", color: "white" }}
        >
          ⬅ Go Back
        </Button>

        <h1>🧾 Place Order</h1>

        {!isLoggedIn ? (
          <section className="place-order-section">
            <h2>Login / Sign Up</h2>
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>Or <a href="#">Sign up</a></p>
          </section>
        ) : (
          <>
            {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3>Logged in as {email}</h3>
              <button onClick={handleLogout} style={{ color: "white", padding: "5px 10px" }}>
                Logout
              </button>
            </div> */}

            {/* Delivery Address */}
            <section className="place-order-section">
              <h2>Delivery Address</h2>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditingAddress} />
              <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditingAddress} />
              <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} disabled={!isEditingAddress} />
              <input type="text" placeholder="Locality" value={locality} onChange={(e) => setLocality(e.target.value)} disabled={!isEditingAddress} />
              <textarea placeholder="Address" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} disabled={!isEditingAddress} />
              <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} disabled={!isEditingAddress} />
              <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} disabled={!isEditingAddress} />
              {!isEditingAddress ? (
                <button onClick={() => setIsEditingAddress(true)}>✏️ Edit Address</button>
              ) : (
                <button onClick={() => {
                  const updated = { name, phone, pincode, locality, address, city, state };
                  localStorage.setItem(`deliveryDetails_${email}`, JSON.stringify(updated));
                  alert("Address updated successfully!");
                  setIsEditingAddress(false);
                }}>✅ Update Address</button>
              )}
            </section>

            {/* Order Summary */}
            <section className="place-order-section">
              <h2>Order Summary</h2>
              {orderedItems.length === 0 ? (
                <p>No products found in your order.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {orderedItems.map((item, index) => (
                    <div key={index} style={{ display: "flex", border: "1px solid #ccc", padding: "10px", borderRadius: "10px" }}>
                      <img src={item.image} alt={item.name} style={{ width: "100px", marginRight: "10px" }} />
                      <div style={{ flex: 1 }}>
                        <h3>{item.name}</h3>
                        <p>Delivery by Mon Jul 28</p>
                        <p>Seller: MYTHANGLORYRetail</p>
                        <p>₹{(item.unitPrice || item.price) * item.quantity}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button onClick={() => {
                            const updated = [...orderedItems];
                            if (updated[index].quantity > 1) {
                              updated[index].quantity -= 1;
                              setOrderedItems(updated);
                              localStorage.setItem("orderedItems", JSON.stringify(updated));
                            }
                          }}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => {
                            const updated = [...orderedItems];
                            updated[index].quantity += 1;
                            setOrderedItems(updated);
                            localStorage.setItem("orderedItems", JSON.stringify(updated));
                          }}>+</button>
                          <button
                            style={{ marginLeft: "auto", color: "red", backgroundColor: "white" }}
                            onClick={() => {
                              const updated = orderedItems.filter((_, i) => i !== index);
                              setOrderedItems(updated);
                              localStorage.setItem("orderedItems", JSON.stringify(updated));
                            }}
                          >Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Payment Section */}
            <section className="place-order-section">
              <h2>Payment Options</h2>

              {/* UPI */}
              <label>
                <input type="radio" name="payment" value="UPI" onChange={(e) => {
                  setPayment(e.target.value);
                  setUpiId("");
                  setUpiValid(null);
                }} />{" "}
                UPI
              </label>

              {payment === "UPI" && (
                <div style={{ marginTop: "10px" }}>
                  <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => {
                    setUpiId(e.target.value);
                    setUpiValid(null);
                  }} style={{ padding: "0.5rem", width: "60%", marginRight: "10px" }} />
                  <button style={{ padding: "0.5rem", backgroundColor: "green", color: "white", marginRight: "10px" }}
                    onClick={() => {
                      const upiRegex = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/;
                      setUpiValid(upiRegex.test(upiId));
                    }}>
                    Verify
                  </button>
                  {upiValid === true && <span style={{ color: "green" }}>Verified</span>}
                  {upiValid === false && <span style={{ color: "red" }}>Invalid UPI ID</span>}
                  {upiValid && (
                    <div style={{ marginTop: "10px", textAlign: "right" }}>
                      <button style={{ padding: "10px", backgroundColor: "orange", color: "white", fontWeight: "bold" }}
                        onClick={() => {
                          alert("Payment successful!");
                          handlePlaceOrder();
                        }}>
                        Pay ₹{totalPayable}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Cash on Delivery */}
              <br />
              <label>
                <input type="radio" name="payment" value="Cash" onChange={(e) => {
                  setPayment(e.target.value);
                  const newCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
                  setCaptcha(newCaptcha);
                  setEnteredCaptcha("");
                }} />{" "}
                Cash on Delivery
              </label>

              {payment === "Cash" && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={{
                      background: "#f0f0f0", padding: "20px", fontWeight: "bold",
                      letterSpacing: "2px", borderRadius: "5px", fontSize: "18px",
                    }}>{captcha}</div>
                    <input type="text" placeholder="Enter CAPTCHA" value={enteredCaptcha}
                      onChange={(e) => setEnteredCaptcha(e.target.value)}
                      style={{ padding: "10px", flex: 1 }} />
                  </div>
                  <button onClick={() => {
                    if (enteredCaptcha === captcha) {
                      alert("Cash on Delivery Confirmed!");
                      handlePlaceOrder();
                    } else {
                      alert("Incorrect CAPTCHA. Try again.");
                    }
                  }} style={{ padding: "10px", backgroundColor: "orange", color: "white" }}>
                    Confirm Order
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Price Details Box */}
      {isLoggedIn && (
        <div className="price-details-box">
          <h3>Price Details</h3>
          <hr />
          <p><strong>Quantity:</strong> {totalQuantity}</p>
          <p><strong>Items Price:</strong> ₹{totalAmount}</p>
          <p><strong>Handling Fee:</strong> ₹{handlingFee}</p>
          <p><strong>Platform Fee:</strong> ₹{platformFee}</p>
          <hr />
          <h4 style={{ color: "green" }}>Total Payable: ₹{totalPayable}</h4>
        </div>
      )}
    </div>
  );
}

export default PlaceOrder;
