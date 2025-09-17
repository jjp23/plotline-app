import React, { useState } from "react";
import "./Profile.css";

function Profile() {
  const [name, setName] = useState("Your Name");
  const [bio, setBio] = useState("Tell us a little about yourself...");
  const [editing, setEditing] = useState(false);

  // Manage lists as state
  const [wantToRead, setWantToRead] = useState([
    { title: "Book A", coverId: 8231990 },
  ]);
  const [currentlyReading, setCurrentlyReading] = useState([
    { title: "Book B", coverId: 912391 },
  ]);
  const [finished, setFinished] = useState([
    { title: "Book C", coverId: 1293871 },
  ]);

  const [menuBook, setMenuBook] = useState(null);

  const moveBook = (book, from, to) => {
    // remove from old list
    if (from === "want") setWantToRead(wantToRead.filter((b) => b !== book));
    if (from === "reading") setCurrentlyReading(currentlyReading.filter((b) => b !== book));
    if (from === "finished") setFinished(finished.filter((b) => b !== book));

    // add to new list
    if (to === "want") setWantToRead([...wantToRead, book]);
    if (to === "reading") setCurrentlyReading([...currentlyReading, book]);
    if (to === "finished") setFinished([...finished, book]);

    setMenuBook(null); // close menu
  };

  const removeBook = (book, from) => {
    if (from === "want") setWantToRead(wantToRead.filter((b) => b !== book));
    if (from === "reading") setCurrentlyReading(currentlyReading.filter((b) => b !== book));
    if (from === "finished") setFinished(finished.filter((b) => b !== book));
    setMenuBook(null);
  };

  return (
    <div className="profile">
      {/* Profile Header */}
      <div className="profile-header">
        {editing ? (
          <>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
            <button onClick={() => setEditing(false)}>Save</button>
          </>
        ) : (
          <>
            <h1>{name}</h1>
            <p>{bio}</p>
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>

      {/* Lists */}
      {[
        { title: "Want To Read", list: wantToRead, from: "want" },
        { title: "Currently Reading", list: currentlyReading, from: "reading" },
        { title: "Finished", list: finished, from: "finished" },
      ].map(({ title, list, from }) => (
        <div key={from} className="list">
          <h2>{title}</h2>
          <div className="book-grid">
            {list.map((book, i) => (
              <div key={i} className="book-item">
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                  alt={book.title}
                  onClick={() => setMenuBook({ book, from })}
                />
                {menuBook && menuBook.book === book && (
                  <div className="book-menu">
                    <button onClick={() => moveBook(book, from, "want")}>Move to Want To Read</button>
                    <button onClick={() => moveBook(book, from, "reading")}>Move to Currently Reading</button>
                    <button onClick={() => moveBook(book, from, "finished")}>Move to Finished</button>
                    <button onClick={() => removeBook(book, from)}>Remove</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Profile;

