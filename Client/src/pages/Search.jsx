import React, { useState } from "react";
import "./Search.css";
import { useAuth } from "../context/AuthContext";

function Search() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); 

  const API_URL = import.meta.env.VITE_API_URL || "https://plotline-app.vercel.app/api";

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=12`);
      const data = await res.json();
      setResults(data.docs || []);
    } catch (err) {
      console.error("Error searching:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToList = async (book, listName) => {
    if (!user) {
      alert("You must be logged in to add books.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          [listName]: [book], 
        }),
      });

      if (!res.ok) throw new Error("Failed to save book");
      alert(`${book.title} added to ${listName}!`);
    } catch (err) {
      console.error("Error saving book:", err);
    } finally {
      setOpenMenu(null); 
    }
  };

  return (
    <div className="search-page">
      <h1>Search Books</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      <div className="search-results">
        {results.map((book, idx) => (
          <div key={idx} className="book-result">
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

            <button onClick={() => setOpenMenu(openMenu === idx ? null : idx)}>
              Add to List
            </button>

            {openMenu === idx && (
              <div className="dropdown-menu">
                <button
                  onClick={() =>
                    addToList(
                      { title: book.title, author: book.author_name?.[0], coverId: book.cover_i },
                      "wantToRead"
                    )
                  }
                >
                  📖 Want To Read
                </button>
                <button
                  onClick={() =>
                    addToList(
                      { title: book.title, author: book.author_name?.[0], coverId: book.cover_i },
                      "currentlyReading"
                    )
                  }
                >
                  📚 Currently Reading
                </button>
                <button
                  onClick={() =>
                    addToList(
                      { title: book.title, author: book.author_name?.[0], coverId: book.cover_i },
                      "finished"
                    )
                  }
                >
                  ✅ Finished
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
