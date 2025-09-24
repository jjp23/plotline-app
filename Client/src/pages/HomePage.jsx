import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchRandomBook() {
      try {
        const searchRes = await fetch(
          "https://openlibrary.org/search.json?subject=fiction&limit=50"
        );
        const searchData = await searchRes.json();

        if (!searchData.docs || searchData.docs.length === 0) {
          setLoading(false);
          return;
        }

        const randomIndex = Math.floor(Math.random() * searchData.docs.length);
        const randomBook = searchData.docs[randomIndex];

        if (randomBook.key) {
          const workRes = await fetch(
            `https://openlibrary.org${randomBook.key}.json`
          );
          const workData = await workRes.json();

          setBook({
            title: workData.title || randomBook.title,
            description:
              workData.description?.value ||
              workData.description ||
              "No summary available for this book.",
            coverId: randomBook.cover_i,
          });
        } else {
          setBook({
            title: randomBook.title,
            description: "No summary available for this book.",
            coverId: randomBook.cover_i,
          });
        }
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRandomBook();
  }, []);

  useEffect(() => {
    async function fetchTrendingBooks() {
      try {
        const res = await fetch(
          "https://openlibrary.org/search.json?q=bestseller&limit=8"
        );
        const data = await res.json();
        setTrendingBooks(data.docs || []);
      } catch (err) {
        console.error("Error fetching trending books:", err);
      }
    }
    fetchTrendingBooks();
  }, []);

  const nextBook = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === trendingBooks.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevBook = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? trendingBooks.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="homepage">
      {/* Welcome Section */}
      <div className="welcome">
        <img src="/logo.png" alt="Plotline Logo" className="welcome-logo" />
        <p className="tagline-intro">
          Track your reading journey. Discover new books. Share your story.
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-btn">Start Tracking</Link>
          <Link to="/search" className="cta-btn secondary">Find a Book</Link>
        </div>
      </div>

      {/* Featured Random Book */}
      <div className="container">
        <div className="hero">
          <div className="hero-text">
            <h3 className="tagline">Have you read this book?</h3>
            {loading ? (
              <p>Loading book...</p>
            ) : book ? (
              <>
                <h1 className="book-title">{book.title}</h1>
                <p className="book-summary">{book.description}</p>
                <button className="cta-btn">+ Add to My List</button>
              </>
            ) : (
              <p>No book found.</p>
            )}
          </div>

          <div className="hero-image">
            {book && book.coverId ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`}
                alt={book.title}
              />
            ) : (
              <div className="placeholder">No Cover Available</div>
            )}
          </div>
        </div>
      </div>

      {/* Trending Books Carousel */}
      <div className="container">
        <div className="trending">
          <h2>Popular Right Now</h2>
          {trendingBooks.length > 0 && (
            <div className="trending-carousel">
              <button onClick={prevBook} className="carousel-btn">‹</button>

              <div className="trending-book">
                {trendingBooks[currentIndex].cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${trendingBooks[currentIndex].cover_i}-M.jpg`}
                    alt={trendingBooks[currentIndex].title}
                  />
                ) : (
                  <div className="placeholder">No Cover</div>
                )}
                <h4>{trendingBooks[currentIndex].title}</h4>
              </div>

              <button onClick={nextBook} className="carousel-btn">›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;