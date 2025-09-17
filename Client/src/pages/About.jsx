import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      <h1>About Plotline</h1>
      <p>
        Plotline was created as my capstone project during my Software Engineering
        Bootcamp. I wanted to combine my love for reading with my new passion for
        web development.
      </p>
      <p>
        While exploring existing book tracking sites, I felt they didn’t fully
        meet my needs as a reader. Plotline is my answer — a simple, clean, and
        customizable way to track what you’re reading, what you want to read, and
        what you’ve finished.
      </p>
      <p>
        Plotline is built with modern web technologies and is designed to grow
        along with me as I continue learning and improving as a developer.
      </p>
    </div>
  );
}
console.log("About page loaded");
export default About;
