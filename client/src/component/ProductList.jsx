import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");

        if (!response.ok) {
          throw new Error(
            `Failed to Load products. Status: ${response.status}`,
          );
        }

        const result = await response.json();

        console.log(result);
        setProducts(result.data);
      } catch (error) {
        console.log("Caught Error: ", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getProduct();
  }, []);

  console.log("ProductList is running");
  return (
    <div>
      <h1 className="underline text-2xl">MiniShop Products</h1>
      <div>
        <div className="flex gap-3 flex-wrap">
          {isLoading ? (
            "Loading Plesase Wait..."
          ) : error ? (
            <div>
              <p>{error.message} </p>
            </div>
          ) : (
            products.map((item) => {
              return <ProductCard key={item._id} product={item} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
