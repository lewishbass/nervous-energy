"use client";

import Image from "next/image";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

interface ShopCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  image: string;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock" | "Coming Soon";
}

export default function ShopCard({ name, price, description, features, image, stockStatus }: ShopCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`h-[200px] md:h-[300px] lg:h-[400px] shop-card ${isExpanded ? "selected" : ""}`} 
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="shop-cover bg2">
        <Image
          src={image}
          alt={`Image of ${name}`}
          className="object-cover w-full h-full"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Overlay with Product Info */}
      <motion.div
        className={`shop-overlay ${
          isExpanded ? "shop-overlay-expanded" : "shop-overlay-collapsed"
        }`}
        layout
      >
          <h2 className="shop-title tc1">{name}</h2>
          
        <div className="flex justify-between items-start">
        <p className="shop-price tc2">{price}</p>
        <span className={`text-nowrap shop-status ${stockStatus.replace(/\s+/g, '-').toLowerCase()}`}>
            {stockStatus}
          </span>
        </div>
        <p className="shop-description tc2 hidden md:block">{description}</p>

        {/* Expanded content with AnimatePresence */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="mt-4 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="shop-features">
                <h3 className="tc1 font-medium mb-2">Features:</h3>
                <ul className="list-disc pl-5 tc2">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <button 
                className="shop-add-button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart logic here
                  alert(`${name} added to cart!`);
                }}
              >
                <FaShoppingCart className="mr-2 inline" /> Add to Cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
