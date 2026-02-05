// Footer component - CLASS COMPONENT (different from Header!)
// The contractor used different patterns in different files

import React, { Component } from 'react';

// Inline styles - DIFFERENT from Header's styled-components!
const footerStyle = {
  backgroundColor: '#1a1a2e',
  color: '#888',
  padding: '2rem',
  textAlign: 'center',
  marginTop: 'auto',
};

const footerContentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const linkStyle = {
  color: '#e94560',
  textDecoration: 'none',
};

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: new Date().getFullYear(),
    };
  }

  render() {
    return (
      <footer style={footerStyle}>
        <div style={footerContentStyle}>
          <p>
            &copy; {this.state.year} FanHub - A fan-made site for TV show enthusiasts
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Built with <span style={{ color: '#e94560' }}>❤</span> by the TechCorp Team
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
            <a href="/about" style={linkStyle}>About</a>
            {' | '}
            <a href="https://github.com" style={linkStyle}>GitHub</a>
            {' | '}
            <a href="/privacy" style={linkStyle}>Privacy</a>
          </p>
        </div>
      </footer>
    );
  }
}

export default Footer;
