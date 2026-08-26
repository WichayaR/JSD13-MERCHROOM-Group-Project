
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../src/data/product';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => String(p.id) === String(productId));

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl text-red-500 font-semibold mb-4">
          Product not found
        </h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-lime-300 text-white px-4 py-2 rounded hover:bg-lime-600 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-6 p-6 bg-white rounded-md shadow-md">
      <button
        onClick={() => navigate('/products')}
        className="mb-6 text-sm font-medium text-black-600 hover:underline flex items-center gap-1"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
       
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 md:h-80 object-cover rounded-lg border"
          />
        )}

        <div className="flex flex-col justify-between h-full">
          <div>
            <h1 className="text-3xl font-bold mb-3 text-gray-800">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>
            <p className="text-3xl font-bold text-black-600 mb-6">
              ฿{product.price?.toLocaleString()}
            </p>
          </div>

          <button className="w-full md:w-auto bg-lime-300 text-black font-medium px-6 py-3 rounded-md hover:bg-lime-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}