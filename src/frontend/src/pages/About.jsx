// About page - simple static content
// This page is pretty basic - needs enhancement

import React from 'react';

// Yet another styling approach - this time using a style tag
// DO NOT DO THIS - it's here to show inconsistency
const AboutStyles = () => (
  <style>{`
    .about-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 0;
    }
    
    .about-hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 3rem 2rem;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .about-hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .about-hero p {
      font-size: 1.1rem;
      color: #aaa;
    }
    
    .about-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      margin-bottom: 1.5rem;
    }
    
    .about-section h2 {
      color: #1a1a2e;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e94560;
    }
    
    .about-section p {
      color: #555;
      line-height: 1.8;
      margin-bottom: 1rem;
    }
    
    .about-section ul {
      list-style: none;
      padding: 0;
    }
    
    .about-section li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }
    
    .about-section li:before {
      content: "✓";
      color: #e94560;
      position: absolute;
      left: 0;
    }
    
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
    
    .team-member {
      text-align: center;
      padding: 1rem;
    }
    
    .team-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      margin: 0 auto 1rem;
    }
    
    .team-member h3 {
      margin: 0;
      color: #1a1a2e;
    }
    
    .team-member p {
      margin: 0.25rem 0 0;
      color: #888;
      font-size: 0.9rem;
    }
  `}</style>
);

const About = () => {
  return (
    <>
      <AboutStyles />
      <div className="about-container">
        <div className="about-hero">
          <h1>About FanHub</h1>
          <p>Your ultimate destination for everything about your favorite show!</p>
        </div>

        <div className="about-section">
          <h2>What is FanHub?</h2>
          <p>
            FanHub is a fan-made website dedicated to celebrating and cataloging 
            everything about your favorite TV shows. From character profiles to 
            memorable quotes, episode guides to behind-the-scenes trivia, we've 
            got it all!
          </p>
          <p>
            This project was built as part of a training workshop to demonstrate 
            how GitHub Copilot can accelerate development while maintaining quality 
            and following best practices.
          </p>
        </div>

        <div className="about-section">
          <h2>Features</h2>
          <ul>
            <li>Comprehensive character database with bios and appearances</li>
            <li>Complete episode guide with descriptions and ratings</li>
            <li>Famous quotes collection with like functionality</li>
            <li>Search across all content</li>
            <li>Responsive design for all devices</li>
            <li>Dark mode support (coming soon!)</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>The Team</h2>
          <p>Built by the TechCorp development team during an 8-hour sprint:</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-avatar">S</div>
              <h3>Sarah</h3>
              <p>Senior Developer</p>
            </div>
            <div className="team-member">
              <div className="team-avatar">M</div>
              <h3>Marcus</h3>
              <p>DevOps Developer</p>
            </div>
            <div className="team-member">
              <div className="team-avatar">P</div>
              <h3>Priya</h3>
              <p>Junior Developer</p>
            </div>
            <div className="team-member">
              <div className="team-avatar">D</div>
              <h3>David</h3>
              <p>Staff Engineer</p>
            </div>
            <div className="team-member">
              <div className="team-avatar">E</div>
              <h3>Elena</h3>
              <p>QA Engineer</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Technology Stack</h2>
          <p>FanHub is built with modern web technologies:</p>
          <ul>
            <li>React 18 with React Router</li>
            <li>Node.js + Express backend</li>
            <li>PostgreSQL database</li>
            <li>Docker for containerization</li>
            <li>GitHub Copilot for AI-assisted development</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Disclaimer</h2>
          <p>
            This is a fan-made site and is not affiliated with, endorsed by, or 
            connected to any official entities related to the show. All trademarks 
            and copyrights belong to their respective owners.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
