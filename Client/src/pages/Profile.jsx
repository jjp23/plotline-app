import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuBook, setMenuBook] = useState(null);
  const [activeTab, setActiveTab] = useState("books"); // 👈 new state for tabs

  const API_URL = import.meta.env.VITE_API_URL || "https://plotline-app.vercel.app/api";

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const endpoint = id ? `${API_URL}/profile/${id}/profile` : `${API_URL}/profile`;
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setProfileData(data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchProfile();
  }, [user, id]);

  async function saveProfile(updatedData) {
    if (id) return;
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
    if (!profileData) return;
    let updatedWant = [...profileData.wantToRead];
    let updatedReading = [...profileData.currentlyReading];
    let updatedFinished = [...profileData.finished];

    if (from === "want") updatedWant = updatedWant.filter((b) => b !== book);
    if (from === "reading") updatedReading = updatedReading.filter((b) => b !== book);
    if (from === "finished") updatedFinished = updatedFinished.filter((b) => b !== book);

    if (to === "want") updatedWant.push(book);
    if (to === "reading") updatedReading.push(book);
    if (to === "finished") updatedFinished.push(book);

    const updatedProfile = {
      ...profileData,
      wantToRead: updatedWant,
      currentlyReading: updatedReading,
      finished: updatedFinished,
    };

    setProfileData(updatedProfile);
    saveProfile(updatedProfile);
    setMenuBook(null);
  };

  const removeBook = (book, from) => {
    if (!profileData) return;
    let updatedWant = [...profileData.wantToRead];
    let updatedReading = [...profileData.currentlyReading];
    let updatedFinished = [...profileData.finished];

    if (from === "want") updatedWant = updatedWant.filter((b) => b !== book);
    if (from === "reading") updatedReading = updatedReading.filter((b) => b !== book);
    if (from === "finished") updatedFinished = updatedFinished.filter((b) => b !== book);

    const updatedProfile = {
      ...profileData,
      wantToRead: updatedWant,
      currentlyReading: updatedReading,
      finished: updatedFinished,
    };

    setProfileData(updatedProfile);
    saveProfile(updatedProfile);
    setMenuBook(null);
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profileData) return <p>No profile found.</p>;

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>{profileData.name}’s Profile</h1>
        <p>{profileData.email}</p>
      </div>

      {/* 🔖 Tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "books" ? "active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          Books
        </button>
        <button
          className={`profile-tab ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </button>
      </div>

      {/* 📚 Books Tab */}
      {activeTab === "books" && (
        <>
          {[
            { title: "Want To Read", list: profileData.wantToRead, from: "want" },
            { title: "Currently Reading", list: profileData.currentlyReading, from: "reading" },
            { title: "Finished", list: profileData.finished, from: "finished" },
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
                          onClick={() => !id && setMenuBook({ book, from })}
                        />
                      ) : (
                        <div className="placeholder">No Cover</div>
                      )}
                      {!id && menuBook && menuBook.book === book && (
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
        </>
      )}

      {/* 👥 Friends Tab */}
      {activeTab === "friends" && (
        <div className="friends">
          <h2>Friends</h2>
          {profileData.friends && profileData.friends.length > 0 ? (
            <ul>
              {profileData.friends.map((friend) => (
                <li key={friend._id}>
                  <Link to={`/profile/${friend._id}`}>{friend.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No friends yet</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
