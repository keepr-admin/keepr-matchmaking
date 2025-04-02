
import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertCircle } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type ProductWithDetails = Tables<"products">;

const ProductsList = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user');
          navigate('/');
          return;
        }
        
        const { data, error } = await supabase
          .from('products')
          .select(`*`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching products:', error);
          return;
        }
        
        if (data) {
          setProducts(data as ProductWithDetails[]);
        }
      } catch (error) {
        console.error('Error in fetchProducts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [navigate]);
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    
    const productInfo = `${product.brand || ''} ${product.model || ''} ${product.type || ''}`.trim().toLowerCase();
    return productInfo.includes(searchQuery.toLowerCase());
  });
  
  // Get status display name and badge color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'live':
        return { label: 'Working', color: 'bg-green-200 text-green-700' };
      case 'broken':
        return { label: 'Broken', color: 'bg-red-200 text-red-700' };
      case 'inactive':
        return { label: 'Inactive', color: 'bg-gray-200 text-gray-700' };
      case 'transferable':
        return { label: 'For Sale', color: 'bg-blue-200 text-blue-700' };
      default:
        return { label: status, color: 'bg-gray-200 text-gray-700' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-keepr-green-800">Your Products</h2>
          <p className="text-keepr-green-600">
            Manage your registered products and their repair history.
          </p>
        </div>
        
        <Button className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>
      
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          className="pl-9"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-white">
          <AlertCircle className="h-12 w-12 text-keepr-green-300 mb-4" />
          <h3 className="text-lg font-medium text-keepr-green-700">No products found</h3>
          <p className="text-sm text-keepr-green-600 mt-1 max-w-md">
            {searchQuery 
              ? "No products match your search criteria. Try using different keywords."
              : "You haven't added any products yet. Click 'Add New Product' to get started."}
          </p>
          
          {!searchQuery && (
            <Button className="btn-primary mt-6">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
          {filteredProducts.map((product) => {
            const { label, color } = getStatusDetails(product.status);
            return (
              <Link to={`/dashboard/products/${product.product_id}`} key={product.product_id}>
                <Card className="card-hover h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-keepr-green-700">
                          {product.type}
                        </h3>
                        <p className="text-keepr-green-600 text-sm">
                          {product.brand} {product.model}
                        </p>
                      </div>
                      <Badge className={color}>{label}</Badge>
                    </div>
                    
                    {product.serial_number && (
                      <p className="text-keepr-green-600 text-sm mt-2">
                        <span className="font-medium">Serial:</span> {product.serial_number}
                      </p>
                    )}
                    
                    <div className="text-keepr-green-600 text-xs mt-4">
                      Added on {format(new Date(product.created_at), 'MMM d, yyyy')}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  return (
    <div>
      <h2>Product Detail</h2>
      <p>This is a placeholder for the product detail view.</p>
    </div>
  );
};

const Products = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsList />} />
      <Route path="/:productId" element={<ProductDetail />} />
    </Routes>
  );
};

export default Products;
