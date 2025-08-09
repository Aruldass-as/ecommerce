import React, { useState, useEffect } from "react";
import axios from "axios";
import { Footer, Navbar } from "../components";

const ProductCatalog = () => {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
    fetchResults('{}');
   }, []);

    function handleSearch(e) {
      e.preventDefault();
      fetchResults(query);
    }

    async function fetchResults(query) {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/search", { query });
      setFilters(res.data.filters);
      setResults(res.data.results);
    } catch (error) {
      alert("Error searching");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function resetSearch(){
    fetchResults('{}');
    setQuery("");
  }

  return (
    <>
    <Navbar />
      
    <div style={{ maxWidth: 600, margin: "auto", padding: 1 }}>
      <h6> Basic search & Option A – Smart Product Search (NLP)</h6>
      <input
        type="text"
        placeholder='Search by Natural Language Catalog Search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: 8, fontSize: 16 }}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        style={{ marginTop: 10, padding: "8px 16px" }}
      >{loading ? "Searching..." : "Search"}
      </button>

      <button
        onClick={resetSearch}
        style={{ marginTop: 10, padding: "8px 16px" }}
      >Reset</button>  

      {filters && results.length === 0 && <p>No matching products found.</p>}
    </div>

    
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>

    {results.length >= 0 && (
  <div style={{ marginTop: 20 }}>
    <h4>Results:</h4>
    <div style={styles.imageGrid}>
      {results.map((product) => (
        <div key={product.id} style={styles.imageCard}>
          {/* <img src={product.image} alt={product.name} style={styles.image} /> */}
          <p style={styles.caption}>{product.name}</p>
          <p>${product.price.toFixed(2)}</p>
          <p>{product.rating}⭐ </p>
        </div>
      ))}
    </div>
  </div>
  
)}
</div>
    <Footer />
    </>
    );

};

const styles = {
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "10px",
    marginTop: "10px",
  },
  imageCard: {
    background: "#fff",
    borderRadius: "8px",
    padding: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  caption: {
    fontSize: "12px",
    marginTop: "5px",
    color: "#333",
  },
};

export default ProductCatalog;
