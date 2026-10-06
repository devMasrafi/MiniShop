import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import ProductList from "./component/ProductList";
import ProductDetails from "./component/ProductDetails";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<App />} /> */}
      <Route path="/" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetails />} />
    </Routes>
  </BrowserRouter>,
);
