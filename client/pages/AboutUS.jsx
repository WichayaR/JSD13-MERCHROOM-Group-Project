import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="p-4 bg-white rounded-md shadow-md max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-teal-600 mb-4">About Us</h1>
      <p className="text-gray-700 mb-4">
        We provide high-quality products and excellent customer service.
      </p>
   
      <h2 className="text-lg font-semibold mb-2">Our Values</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
        <li>Quality first</li>
        <li>Honesty & Integrity</li>
        <li>Customer satisfaction</li>
      </ul>

      <div className="flex gap-4">
        <Link 
          to="/" 
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Home
        </Link>
        <Link 
          to="/products" 
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
        >
          Products
        </Link>
      </div>
    </div>
  );
}