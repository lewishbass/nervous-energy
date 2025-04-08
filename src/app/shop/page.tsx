"use client";

import ShopCard from "./ShopCard";
import shopProducts from "@/data/shopProducts";
import "./shop.css";

export default function Shop() {
  const { stickers, electronics, services } = shopProducts;

  return (
    <div className="p-6 max-w-6xl mx-auto w-fill md:w-[700px] lg:w-[1000px] xl:w-[1200px]">
      <h1 className="text-4xl font-bold mb-6 tc1">Shop</h1>
      
      {/* Stickers Section */}
      <h2 className="tc1 section-header">Stickers</h2>
      <div className="w-[90%] translate-x-1/18 h-[4px] mb-[1rem] rounded-full"
      style={{backgroundColor:"var(--khr)"}}/>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stickers.map((product, index) => (
          <ShopCard
            key={`sticker-${index}`}
            name={product.name}
            price={product.price}
            description={product.description}
            features={product.features}
            image={product.image}
            stockStatus={product.stockStatus}
          />
        ))}
      </div>
      
      {/* Electronics Section */}
      <h2 className="tc1 section-header">Electronics</h2>
      <div className="w-[90%] translate-x-1/18 h-[4px] mb-[1rem] rounded-full"
      style={{backgroundColor:"var(--kho)"}}/>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {electronics.map((product, index) => (
          <ShopCard
            key={`electronics-${index}`}
            name={product.name}
            price={product.price}
            description={product.description}
            features={product.features}
            image={product.image}
            stockStatus={product.stockStatus}
          />
        ))}
      </div>
      
      {/* Services Section */}
      <h2 className="tc1 section-header">Services</h2>
      <div className="w-[90%] translate-x-1/18 h-[4px] mb-[1rem] rounded-full"
      style={{backgroundColor:"var(--khy)"}}/>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {services.map((product, index) => (
          <ShopCard
            key={`service-${index}`}
            name={product.name}
            price={product.price}
            description={product.description}
            features={product.features}
            image={product.image}
            stockStatus={product.stockStatus}
          />
        ))}
      </div>
    </div>
  );
}