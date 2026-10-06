import { useNavigate } from "react-router";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div
      className="border px-2 py-4 w-35 h-40 cursor-pointer"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <h2>{product.name}</h2>
      <h1>{product.price}</h1>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductCard;
