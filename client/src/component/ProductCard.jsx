import { useNavigate } from 'react-router'

const ProductCard = ({ product, className }) => {
  const navigate = useNavigate()
  return (
    <div
      className={`${className} h-100 w-55 cursor-pointer rounded-md border px-2 py-4`}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div>
        <img className='w-53 h-50 mb-2'
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS72UbY52iLq25DVzt-BFGrEEbfGWAFEy3GSQmdOltFe1-0xCFnp1xSo8gn&s=10"
          alt="products-in-woven-basket"
        />
      </div>
      <div className="flex h-40 w-full flex-col justify-between">
        <div>
          <h2>{product.name}</h2>
          <h1 className="text-2xl font-medium">${product.price}</h1>
          <p className='text-gray-600/50'>{product.description}</p>
        </div>
        <div className="flex justify-between text-sm">
          <h2 className="uppercase">on sale</h2>
          <h2 className="">Stock: 25</h2>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
