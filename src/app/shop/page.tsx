export default function Shop() {
    const products = [
      { name: 'Premium T-Shirt', price: '$29.99', category: 'Clothing' },
      { name: 'Coffee Mug', price: '$14.99', category: 'Accessories' },
      { name: 'Laptop Sleeve', price: '$24.99', category: 'Electronics' },
    ];
  
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 tc1">Shop</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <div key={index} className="bg2 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2 tc1">{product.name}</h2>
              <p className="tc2">{product.price}</p>
              <p className="tc3">{product.category}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }