import { useState } from "react";

function AddFriends() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "https://plotline-app.vercel.app/api";

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/search?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data);
        if (data.length === 0) setMessage("No users found.");
      } else {
        setMessage(data.message || "Error searching users.");
      }
    } catch (err) {
      setMessage("Error searching users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/profile/${id}/add-friend`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(data.message || "Error adding friend.");
      }
    } catch (err) {
      setMessage("Error adding friend.");
      console.error(err);
    }
  };

  return (
    <div className="add-friends">
      <h1>Find Friends</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {message && <p>{message}</p>}

      <ul className="results-list">
        {results.map((u) => (
          <li key={u._id}>
            <span>{u.name} ({u.email})</span>
            <button onClick={() => addFriend(u._id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddFriends;
