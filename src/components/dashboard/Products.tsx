
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

const ProductsList = () => {
  return (
    <div>
      <h2>Products List</h2>
      <p>This is a placeholder for the products list view.</p>
    </div>
  );
};

const ProductDetail = () => {
  return (
    <div>
      <h2>Product Detail</h2>
      <p>This is a placeholder for the product detail view.</p>
    </div>
  );
};

const Products = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsList />} />
      <Route path="/:productId" element={<ProductDetail />} />
    </Routes>
  );
};

export default Products;
