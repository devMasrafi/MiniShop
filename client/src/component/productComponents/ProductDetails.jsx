import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const ProductDetails = () => {
  const params = useParams();

  const [singleProduct, setSingleProduct] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // console.log(singleProduct.name);
  console.log(singleProduct);

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/products/${params.id}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to get product. Status: ${response.status} `);
        }

        const result = await response.json();
        setSingleProduct(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getSingleProduct();
  }, [params.id]);

  return (
    <div>
      <h1>Product details</h1>

      <div>
        <Link
          to="/"
          className="px-2 py-1 capitalize bg-gray-600/20 rounded-md mt-2"
        >
          go back
        </Link>
      </div>

      {isLoading ? (
        "Loading Please wait..."
      ) : error ? (
        error.message
      ) : (
        <div>
          <h2>{singleProduct.price} </h2>
          <h1>{singleProduct.name}</h1>
          <p>{singleProduct.description} </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
