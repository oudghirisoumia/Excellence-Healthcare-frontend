import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let endpoint = '/products';
        
        // If category is selected, filter by category
        if (categoryId) {
          endpoint = `/categories/${categoryId}/products`;
        }
        
        const response = await api.get(endpoint);
        setProducts(response.data.data || response.data.products || response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les produits");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

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
  if (products.length === 0) return <div className="text-center py-20 text-xl">Aucun produit trouvé</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Nos Produits</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
  );
}