import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MarketplaceDashboard from '../components/marketplace/MarketplaceDashboard';
import ProductCategory from '../components/marketplace/ProductCategory';
import ProductDetails from '../components/marketplace/ProductDetails';
import Checkout from './marketplace/Checkout';

export default function Marketplace() {
  return (
    <Routes>
      <Route index element={<MarketplaceDashboard />} />
      <Route path="category/:categoryId" element={<ProductCategory />} />
      <Route path="product/:productId" element={<ProductDetails />} />
      <Route path="checkout" element={<Checkout />} />
    </Routes>
  );
}