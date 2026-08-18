import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import products from "./Data/Products.json";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Header from "./Flipkart/Header";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Cart from "./Flipkart/Cart";
import PlaceOrder from "./Flipkart/PlaceOrder";
import ProductDetail from "./Flipkart/ProductDetail";
import Footer from "./Flipkart/Footer";
import OrderConfirmation from "./Flipkart/OrderConfirmation";
import MyOrder from "./Flipkart/MyOrder";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [authMessage, setAuthMessage] = useState("");

  const hardcodedUsers = [
    { email: "aashika15@gmail.com", password: "Aashika15" },
    { email: "aashi15@gmail.com", password: "Aashi15" },
  ];

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    const updatedCart = cart.filter((_, i) => i !== indexToRemove);
    setCart(updatedCart);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!email || !password || (!showLogin && (!name || !confirmPassword))) {
      setAuthMessage("Please fill in all fields.");
      return;
    }

    if (!showLogin && password !== confirmPassword) {
      setAuthMessage("Passwords do not match.");
      return;
    }

    if (showLogin) {
      const user =
        hardcodedUsers.find((u) => u.email === email && u.password === password) ||
        users.find((u) => u.email === email && u.password === password);

      if (!user) {
        setAuthMessage("Invalid credentials.");
        return;
      }
    } else {
      const exists = users.find((u) => u.email === email) || hardcodedUsers.find((u) => u.email === email);
      if (exists) {
        setAuthMessage("Email already registered.");
        return;
      }

      const newUsers = [...users, { email, password, name }];
      localStorage.setItem("users", JSON.stringify(newUsers));
    }

    const userName = name || email.split("@")[0];
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", userName);
    localStorage.setItem("email", email);
    setUsername(userName);
    setEmail(email);
    setLoggedIn(true);
    setAuthMessage("Login successful!");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setLoggedIn(false);
    setUsername("");
    setEmail("");
  };

  const handlePlaceOrder = () => {
    const currentDate = new Date().toLocaleDateString();
    const orderWithDate = cart.map(item => ({
      ...item,
      date: currentDate,
    }));

    const existingOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
    const updatedOrders = [...existingOrders, ...orderWithDate];

    localStorage.setItem(`orders_${email}`, JSON.stringify(updatedOrders));
    setCart([]);
  };

  return (
    <Router>
      {!loggedIn ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f2f2f2"
        }}>
          <div style={{
            maxWidth: "400px", width: "100%", padding: "2rem", backgroundColor: "#fff",
            border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Welcome to E-Bazaar</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "1rem" }}>
              <Button variant={showLogin ? "contained" : "outlined"} onClick={() => setShowLogin(true)}>Login</Button>
              <Button variant={!showLogin ? "contained" : "outlined"} onClick={() => setShowLogin(false)}>Sign Up</Button>
            </div>

            <form onSubmit={handleAuthSubmit}>
              {!showLogin && (
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange}
                  style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              )}
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
                style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
                style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              {!showLogin && (
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}
                  style={{ width: "100%", padding: "10px", marginBottom: "16px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {showLogin ? "Login" : "Sign Up"}
              </Button>
              {authMessage && (
                <p style={{ marginTop: "12px", textAlign: "center", color: "green" }}>{authMessage}</p>
              )}
            </form>
          </div>
        </div>
      ) : (
        <>
          <Header username={username} onSearch={setSearchText} cartCount={cart.length} />

          <div style={{ display: "flex" }}>
            <div style={{
              width: "200px", padding: "1rem", backgroundColor: "#f5f5f5", borderRight: "1px solid #ddd",
              height: "100vh", position: "sticky", top: 0
            }}>
              <h3 style={{ color: "blue", fontSize: "18pt" }}>Categories</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {["All", "Electronics", "Grocery", "Fashion", "Toys", "Books", "Mobiles", "Furniture"].map((cat) => (
                  <li key={cat} onClick={() => setSelectedCategory(cat)} style={{
                    padding: "8px", cursor: "pointer", paddingTop: "15px", fontSize: "15pt",
                    backgroundColor: selectedCategory === cat ? "#ddd" : "transparent", borderRadius: "4px"
                  }}>{cat}</li>
                ))}
              </ul>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ padding: "10px", textAlign: "right", marginRight: "20px" }}>
                <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
              </div>

              <Routes>
                <Route path="/" element={
                  <>
                    <h1 style={{ paddingLeft: "20px" }}>E-Bazaar</h1>
                    <h3 style={{ paddingLeft: "20px" }}>Category: {selectedCategory}</h3>
                    <div style={{
                      display: "flex", flexWrap: "wrap", gap: "20px",
                      paddingLeft: "95px", paddingRight: "50px"
                    }}>
                      {filteredProducts.map((product) => (
                        <div key={product.id} style={{
                          border: "1px solid #ddd", padding: "1rem", width: "250px",
                          borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                          boxSizing: "border-box", gap: "0.5rem"
                        }}>
                          <Link to={`/product/${product.id}`} style={{
                            textDecoration: "none", color: "inherit", flex: 1
                          }}>
                            <h2 style={{ fontSize: "15pt", margin: "0 0 8px 0" }}>{product.name}</h2>
                            <img src={product.image} alt={product.name} style={{
                              width: "100%", height: "160px", borderRadius: "4px", marginBottom: "6px"
                            }} />
                            <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
                              <p style={{ margin: "2px 0" }}><strong>Price:</strong> ₹{product.price}</p>
                              <p style={{ margin: "2px 0" }}><strong>Rating:</strong> ⭐{product.rating} ({product.reviews})</p>
                            </div>
                          </Link>
                          <Button variant="contained" endIcon={<AddShoppingCartIcon />} onClick={() => handleAddToCart(product)}
                            style={{ padding: "6px 0px", color: "white", fontWeight: "bold", marginTop: "0.5rem" }}>
                            Add to Cart
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                } />
                <Route path="/cart" element={<Cart cartItems={cart} onRemoveFromCart={handleRemoveFromCart} />} />
                <Route path="/placeorder" element={<PlaceOrder cartItems={cart} onPlaceOrder={handlePlaceOrder} />} />
                <Route path="/product/:productId" element={<ProductDetail products={products} onAddToCart={handleAddToCart} />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/myorders" element={<MyOrder />} />
              </Routes>
            </div>
          </div>

          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message={snackbarMessage}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />

          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;



