import Link from "next/link";

export default function Navbar() {
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
        <div className="flex items-centerspace-x-4"></div>
      </div>
    </nav>
  );
}
