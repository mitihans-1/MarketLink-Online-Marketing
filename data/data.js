// data/data.js

// Sample product data for MarketLink Online
const products = [
  { id: 1, name: "Laptop", price: 1200, category: "Electronics" },
  { id: 2, name: "Smartphone", price: 800, category: "Electronics" },
  { id: 3, name: "Running Shoes", price: 100, category: "Sports" },
  { id: 4, name: "Backpack", price: 50, category: "Accessories" }
];

// Function to display all products
function showProducts() {
  console.log("=== MarketLink Products ===");
  products.forEach((product) => {
    console.log(`${product.id}. ${product.name} - ${product.category} - $${product.price}`);
  });
}

// Export the data and function
module.exports = { products, showProducts };

// If run directly, show products
if (require.main === module) {
  showProducts();
}
