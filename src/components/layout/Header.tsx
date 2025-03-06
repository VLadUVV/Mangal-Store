import { Link } from "react-router-dom";
import { ShoppingCart, User, Home, MessageSquare, Info, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex w-full md:w-auto justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-mangal-600">
            <img src="img/logo.png" className="flex max-w-20 max-h-20 justify-start"></img>
            </Link>
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </Button>
          </div>
          
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto mt-4 md:mt-0`}>
            <Link to="/" className="flex items-center space-x-1 text-gray-600 hover:text-mangal-600">
              <Home size={20} />
              <span>Главная</span>
            </Link>
            
            <Link to="/about" className="flex items-center space-x-1 text-gray-600 hover:text-mangal-600">
              <Info size={20} />
              <span>О нас</span>
            </Link>
            
            <Link to="/reviews" className="flex items-center space-x-1 text-gray-600 hover:text-mangal-600">
              <MessageSquare size={20} />
              <span>Отзывы</span>
            </Link>
            
            <Link to="/cart" className="flex items-center space-x-1 text-gray-600 hover:text-mangal-600">
              <ShoppingCart size={20} />
              <span>Корзина</span>
            </Link>
            
            <Link to="/profile">
              <Button variant="outline" className="flex items-center space-x-2 w-full md:w-auto">
                <User size={20} />
                <span>Профиль</span>
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};