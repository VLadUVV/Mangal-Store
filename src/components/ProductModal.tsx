import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  description: string;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Get existing cart items
    const existingCartString = localStorage.getItem('cart');
    let cartItems = [];
    
    if (existingCartString) {
      try {
        cartItems = JSON.parse(existingCartString);
      } catch (error) {
        console.error('Ошибка добавления в корзину', error);
      }
    }

    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // If product exists, increment quantity
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // If product doesn't exist, add it with quantity 1
      cartItems.push({ ...product, quantity: 1 });
    }

    // Save updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Call the original onAddToCart handler
    onAddToCart(product);

    // Show success toast
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в корзину.`
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="grid gap-4">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-64 object-contain rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-xl font-semibold text-mangal-600">
            {product.price.toFixed(2)}₽
            </p>
            <p className="text-gray-600">{product.description}</p>
            
            <Button 
              onClick={handleAddToCart}
              className="w-full"
            >
              Добавить в корзину
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}