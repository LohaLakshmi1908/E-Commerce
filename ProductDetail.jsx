import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import "./ProductDetails.css";

const ProductDetail = ({ products, onAddToCart }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);

  const [mainImage, setMainImage] = useState(product?.image || "");

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  if (!product) {
    return <div>Product not found.</div>;
  }

  const handleBuyNow = () => {
    const orderProduct = { ...product, quantity: 1 };
    localStorage.setItem("orderedItems", JSON.stringify([orderProduct]));
    navigate("/placeorder");
  };

  return (
    <div className="product-detail-container">
      <Button variant="outlined" onClick={() => navigate(-1)} className="back-button">
        ⬅ Go Back
      </Button>

      <div className="product-detail-wrapper">
        {/* ✅ Main and child images */}
        <div className="product-image-gallery">
          <div className="thumbnail-images">
            {(product.images || [product.image])
              .slice(0, 3)
              .map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className="thumbnail"
                  onClick={() => setMainImage(img)}
                />
              ))}
          </div>

          <img src={mainImage} alt={product.name} className="product-image" />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Rating:</strong> ⭐{product.rating} ({product.reviews} reviews)</p>

          <h3>Specifications:</h3>
          <ul>
            {Object.entries(product.specs).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
            <Button
              variant="contained"
              endIcon={<AddShoppingCartIcon />}
              onClick={() => onAddToCart(product)}
              className="add-to-cart-btn"
              style={{ backgroundColor: "orange" }}
            >
              Add to Cart
            </Button>

            <Button
              variant="contained"
              color="primary"
              endIcon={<ShoppingBagIcon />}
              onClick={handleBuyNow}
              className="buy-now-btn"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
