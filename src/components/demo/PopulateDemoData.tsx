
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PopulateDemoData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addDemoData = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You need to be logged in to add demo data");
        return;
      }
      
      // Add demo products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .insert([
          {
            user_id: user.id,
            type: 'Coffee machine',
            brand: 'Philips',
            model: 'HD7462',
            status: 'broken'
          },
          {
            user_id: user.id,
            type: 'Laptop',
            brand: 'Dell',
            model: 'XPS 13',
            status: 'broken'
          },
          {
            user_id: user.id,
            type: 'Radio',
            brand: 'Sony',
            model: 'ICF-P26',
            status: 'broken'
          }
        ])
        .select();
        
      if (productsError) {
        console.error('Error adding demo products:', productsError);
        toast.error("Failed to add demo products");
        return;
      }
      
      // Add repair requests for each product
      if (products && products.length > 0) {
        const repairRequests = products.map((product, index) => {
          let description = '';
          let status = 'pending';
          
          if (product.type === 'Coffee machine') {
            description = 'My coffee machine is not heating up. It powers on but doesn\'t get hot enough to brew coffee.';
          } else if (product.type === 'Laptop') {
            description = 'The keyboard on my laptop has several keys that aren\'t working. Some keys require too much pressure.';
            status = 'accepted';
          } else if (product.type === 'Radio') {
            description = 'My vintage radio turns on but produces a loud static noise. The tuning knob doesn\'t seem to work properly.';
          }
          
          return {
            user_id: user.id,
            product_id: product.product_id,
            description,
            status,
            created_at: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString()
          };
        });
        
        const { error: repairRequestsError } = await supabase
          .from('repair_requests')
          .insert(repairRequests);
          
        if (repairRequestsError) {
          console.error('Error adding demo repair requests:', repairRequestsError);
          toast.error("Failed to add demo repair requests");
          return;
        }
        
        toast.success("Demo data added successfully");
      }
    } catch (error) {
      console.error('Error in addDemoData:', error);
      toast.error("An error occurred while adding demo data");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={addDemoData}
      disabled={isLoading}
      className="mt-4"
    >
      {isLoading ? "Adding Demo Data..." : "Add Demo Data"}
    </Button>
  );
};

export default PopulateDemoData;
