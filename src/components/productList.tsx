// components/ProductListMock.tsx
import { ProductCardMock } from "./productCard";

const dummyProducts = [
  {
    id: 1,
    name: "Organic Bananas",
    category: "Fruits",
    price: "Rp 25.000",
    originalPrice: "Rp 32.000",
    unit: "per bunch",
    image: "/images/banana.jpg",
    discount: 22,
  },
  {
    id: 2,
    name: "Fresh Spinach",
    category: "Vegetables",
    price: "Rp 15.000",
    unit: "per 250g",
    image: "/images/spinach.jpg",
  },
  {
    id: 3,
    name: "Free-Range Eggs",
    category: "Dairy & Eggs",
    price: "Rp 35.000",
    unit: "per 10 pcs",
    image: "/images/eggs.jpg",
  },
  {
    id: 4,
    name: "Whole Grain Bread",
    category: "Bakery",
    price: "Rp 28.000",
    unit: "per loaf",
    image: "/images/bread.jpg",
  }
];

export function ProductListMock() {
  return (
    <section id="products" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Fresh Products
          </h2>
          <p className="text-muted-foreground mt-1">
            Discover our selection of fresh groceries
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {dummyProducts.map((product) => (
            <ProductCardMock key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
