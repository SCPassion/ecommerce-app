"use client";
import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false); // Close mobile menu on larger screens
      }
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">SCP's Ecommerce</Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/checkout">checkout</Link>
        </div>

        {/* Carts Info */}
        <div className="flex items-center space-x-4">
          <Link href="/checkout" className="relative">
            <ShoppingCartIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <XMarkIcon /> : <Bars3Icon />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="bg-white shadow-md">
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link href="/" className="block hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="block hover:text-blue-600">
                Products
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="block hover:text-blue-600">
                Checkout
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </nav>
  );
}
