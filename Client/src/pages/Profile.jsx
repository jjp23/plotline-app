import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();
  const [wantToRead, setWantToRead] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [finished, setFinished] = useState([]);
  const [menuBook, setMenuBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://plotline-app.vercel.app/api";

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) {
          setWantToRead(data.wantToRead || []);
          setCurrentlyReading(data.currentlyReading || []);
          setFinished(data.finished || []);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchProfile();
  }, [user]);

  async function saveProfile(updatedData) {
    try {
      await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  }

  const moveBook = (book, from, to) => {
    let updatedWant = [...wantToRead];
    let updatedReading = [...currentlyReading];
    let updatedFinished = [...finished];

    if (from === "want") updatedWant = updatedWant.filter((b) => b !== book);
    if (from === "reading") updatedReading = updatedReading.filter((b) => b !== book);
    if (from === "finished") updatedFinished = updatedFinished.filter((b) => b !== book);

    if (to === "want") updatedWant.push(book);
    if (to === "reading") updatedReading.push(book);
    if (to === "finished") updatedFinished.push(book);

    setWantToRead(updatedWant);
    setCurrentlyReading(updatedReading);
    setFinished(updatedFinished);

    saveProfile({ wantToRead: updatedWant, currentlyReading: updatedReading, finished: updatedFinished });
    setMenuBook(null);
  };

  const removeBook = (book, from) => {
    let updatedWant = [...wantToRead];
    let updatedReading = [...currentlyReading];
    let updatedFinished = [...finished];

    if (from === "want") updatedWant = updatedWant.filter((b) => b !== book);
    if (from === "reading") updatedReading = updatedReading.filter((b) => b !== book);
    if (from === "finished") updatedFinished = updatedFinished.filter((b) => b !== book);

    setWantToRead(updatedWant);
    setCurrentlyReading(updatedReading);
    setFinished(updatedFinished);

    saveProfile({ wantToRead: updatedWant, currentlyReading: updatedReading, finished: updatedFinished });
    setMenuBook(null);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile">
      <h1>{user?.name}’s Profile</h1>
      <p>{user?.email}</p>

      {[
        { title: "Want To Read", list: wantToRead, from: "want" },
        { title: "Currently Reading", list: currentlyReading, from: "reading" },
        { title: "Finished", list: finished, from: "finished" },
      ].map(({ title, list, from }) => (
        <div key={from} className="list">
          <h2>{title}</h2>
          <div className="book-grid">
            {list.length > 0 ? (
              list.map((book, i) => (
                <div key={i} className="book-item">
                  {book.coverId ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                      alt={book.title}
                      onClick={() => setMenuBook({ book, from })}
                    />
                  ) : (
                    <div className="placeholder">No Cover</div>
                  )}
                  {menuBook && menuBook.book === book && (
                    <div className="book-menu">
                      <button onClick={() => moveBook(book, from, "want")}>Move to Want To Read</button>
                      <button onClick={() => moveBook(book, from, "reading")}>Move to Currently Reading</button>
                      <button onClick={() => moveBook(book, from, "finished")}>Move to Finished</button>
                      <button onClick={() => removeBook(book, from)}>Remove</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No books yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Profile;
