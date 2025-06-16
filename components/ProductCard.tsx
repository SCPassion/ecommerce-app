import Link from "next/link";
import Image from "next/image";
import Stripe from "stripe";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

type ProductCardProps = {
  product: Stripe.Product;
};
export default function ProductCard({ product }: ProductCardProps) {
  const price = product.default_price as Stripe.Price;

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0">
        {product.images && product.images[0] && (
          <div className="relative h-80 w-full">
            <Image
              alt={product.name}
              src={product.images[0]}
              layout="fill"
              objectFit="cover"
              className="group-hover:opacity-90 transition-opacity duration-500 ease-in-out"
            />
          </div>
        )}

        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold text-gray-800">
            {product.name}
          </CardTitle>
          <CardContent className="p-4 flex-grow flex flex-col justify-between">
            {product.description && (
              <p className="text-gray-600 text-sm mb-2">
                {product.description}
              </p>
            )}
            {price && price.unit_amount && (
              <p className="text-lg font-semibold text-gray-900">
                ${(price.unit_amount / 100).toFixed(2)}
              </p>
            )}

            <Button> View Details </Button>
          </CardContent>
        </CardHeader>
      </Card>
    </Link>
  );
}
