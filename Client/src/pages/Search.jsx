import React, { useState } from "react";
import "./Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
      const data = await res.json();
      setResults(data.docs);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  };

  return (
    <div className="search-page">
      <h1>Search for Books</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          placeholder="Search by title, author, or keyword..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="search-results">
        {results.map((book, i) => (
          <div key={i} className="search-card">
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
              />
            ) : (
              <div className="placeholder">No Cover</div>
            )}
            <h3>{book.title}</h3>
            <p>{book.author_name ? book.author_name.join(", ") : "Unknown Author"}</p>
            <button>+ Add to List</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
