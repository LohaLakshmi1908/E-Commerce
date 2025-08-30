import React, { useState } from "react";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment"; // ✅ New icon
import "./Header.css";

const Header = ({ username, onCategorySelect, onSearch, cartCount }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = () => {
    onSearch(searchInput);
    setSidebarOpen(false);
  };

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="left-section">
          <div className="brand-with-home">
            <span className="brand-name">ShopKart</span>
            <Link to="/" className="home-icon">
              <HomeIcon />
            </Link>
            {username && (
              <div className="welcome-msg">Welcome, {username}!</div>
            )}
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="right-section">
          <Link to="/myorders" className="nav-icon my-orders-icon" title="My Orders">
            <AssignmentIcon />
          </Link>

          <Link to="/cart" className="nav-icon cart-icon-wrapper" title="Cart">
            <ShoppingCartIcon />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
