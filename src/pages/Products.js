import { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard'; // your card we fixed
import '../styles/ProductGrid.css'

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(response.data.data); // Laravel paginates → data.data
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de charger les produits");
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    alert(`Ajouté au panier : ${product.name}`);
    // Later: connect to real cart API
  };

  const handleToggleFavorite = (productId) => {
    alert(`Favoris cliqué : ${productId}`);
    // Later: connect to /favorites/toggle
  };

  if (loading) return <div className="text-center py-20 text-xl">Chargement des produits...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Nos Produits</h1>
      
      <div className="product-grid-container">
        <div className="product-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}