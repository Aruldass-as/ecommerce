const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const PORT = process.env.PORT || 4001;

//openai call
const cors = require("cors");
require('dotenv').config();
const express = require('express');
const OpenAI = require("openai");

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// UncaughtException Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

// connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(PORT, () => {
    console.log(`Server running`)
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});

// static list data
const catalog = [
  { id: 1, name: "Organic Apples", price: 10, category: "fruits", description: "Fresh organic apples, crisp and sweet.", rating: 4.8},
  { id: 2, name: "Bananas", price: 20, category: "fruits", description: "Ripe yellow bananas full of potassium.", rating: 2.5},
  { id: 3, name: "Almond Milk", price: 30, category: "dairy", description: "Unsweetened almond milk, perfect for smoothies.", rating: 3.4},
  { id: 4, name: "Wheat Bread", price: 40, category: "bakery", description: "Freshly baked whole wheat sandwich bread.", rating: 4.5 },
  { id: 5, name: "Range Eggs", price: 50, category: "eggs", description: "A dozen free-range brown eggs from local farms.", rating: 5.0},
  { id: 6, name: "Greek Yogurt", price: 60, category: "dairy", description: "Creamy Greek yogurt, high in protein.", rating: 4.6 },
  { id: 7, name: "Cheddar Cheese", price: 70, category: "dairy", description: "Aged cheddar cheese with rich flavor.", rating: 3.8 },
  { id: 8, name: "Fresh Salmon", price: 80, category: "seafood", description: "Wild-caught salmon fillet, perfect for grilling.", rating: 2.9},
  { id: 9, name: "Chicken Breast", price: 90, category: "meat", description: "Boneless, skinless chicken breast for healthy meals.", rating: 1.7},
  { id: 10, name: "Ground Beef", price: 100, category: "meat", description: "Lean ground beef, great for burgers and tacos.", rating: 4.6 },
  { id: 11, name: "Pasta Spaghetti", price: 110, category: "pantry", description: "Classic Italian spaghetti pasta.", rating: 3.5},
  { id: 12, name: "Tomato Sauce", price: 120, category: "pantry", description: "Rich tomato sauce with Italian herbs.", rating: 2.4 },
  { id: 13, name: "Olive Oil", price: 130, category: "pantry", description: "Extra virgin olive oil, cold-pressed.", rating: 1.9 },
  { id: 14, name: "Brown Rice", price: 140, category: "pantry", description: "Whole grain brown rice for healthy meals.", rating: 4.6 },
  { id: 15, name: "Quinoa", price: 150, category: "pantry", description: "High-protein quinoa, perfect for salads.", rating: 3.7 },
  { id: 16, name: "Avocado", price: 160, category: "fruits", description: "Creamy avocados full of healthy fats.", rating: 2.8 },
  { id: 17, name: "Strawberries", price: 170, category: "fruits", description: "Sweet and juicy fresh strawberries.", rating: 4.9},
  { id: 18, name: "Spinach", price: 180, category: "vegetables", description: "Fresh spinach leaves, great for salads.", rating: 3.7},
  { id: 19, name: "Carrots", price: 190, category: "vegetables", description: "Crunchy carrots, full of vitamin A.", rating: 4.6},
  { id: 20, name: "Potatoes", price: 200, category: "vegetables", description: "Versatile potatoes for roasting, mashing, or frying.", rating: 1.5 }
];

// parseQuery
async function parseQuery(naturalQuery) {
  const prompt = `
  User query: "${naturalQuery}"
  Return only JSON.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You extract search filters as JSON from natural language queries. Keys can include: category, max_price, min_price, min_rating, max_rating, name." },
      { role: "user", content: prompt }
    ],
    temperature: 0,
  });
  const completionText = response.choices[0].message.content.trim();
  const cleaned = completionText.replace(/^```json/, '').replace(/```$/, '').trim();
  return JSON.parse(cleaned);
}

// post api call
app.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query missing" });

  try {
    const filters = await parseQuery(query);

    const category = filters.category ? filters.category.toLowerCase() : null;
    const maxPrice = filters.max_price !== null ? Number(filters.max_price) : Infinity;
    const minPrice = filters.min_price != null ? Number(filters.min_price) : 0;
    const minRating = filters.min_rating !== null ? Number(filters.min_rating) : 0;
    const maxRating = filters.max_rating !== null ? Number(filters.max_rating) : Infinity;
    const name = filters.name ? filters.name.toLowerCase() : null;

    if (!category && !name && maxPrice === Number.MAX_SAFE_INTEGER && minPrice === Number.MIN_SAFE_INTEGER && minRating === 0 && maxRating === 0) {
      return res.json({ filters, results: catalog });
    }

    const results = catalog.filter(product => {
      const productCategory = product.category.toLowerCase();
      const productName = product.name.toLowerCase();



      if (category && !productCategory.includes(category)) return false;
      if (name && !productName.includes(name)) return false;
      if (product.price > maxPrice) return false;
      if (product.price < minPrice) return false;
      if (product.rating < minRating) return false;
      if (product.rating > maxRating) return false;
      return true;
    });

    res.json({ filters, results });
  } catch (error) {
    console.error("Error in /search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
