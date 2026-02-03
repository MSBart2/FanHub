// Characters page - displays all characters
// Uses a different coding style than Home.jsx!

import React, { useState, useEffect } from 'react';
import CharacterCard from '../components/CharacterCard';
import { charactersApi } from '../services/api';

// Inline styles again - INCONSISTENT with Home.jsx which uses styled-components
const styles = {
  container: {
    padding: '1rem 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    color: '#1a1a2e',
    margin: 0,
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  select: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  searchInput: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    width: '200px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '1rem',
    borderRadius: '8px',
  },
  noResults: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    gridColumn: '1 / -1',
  },
};

// Using class component here - DIFFERENT from Home which is functional
// (The contractor couldn't decide on a pattern)
class Characters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      loading: true,
      error: null,
      filter: 'all', // all, main, supporting
      statusFilter: 'all',
      searchTerm: '',
    };
  }

  componentDidMount() {
    this.loadCharacters();
  }

  loadCharacters = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      const params = {};
      if (this.state.filter === 'main') {
        params.is_main = 'true';
      } else if (this.state.filter === 'supporting') {
        params.is_main = 'false';
      }
      
      if (this.state.statusFilter !== 'all') {
        params.status = this.state.statusFilter;
      }
      
      if (this.state.searchTerm) {
        params.search = this.state.searchTerm;
      }
      
      const response = await charactersApi.getAll(params);
      this.setState({ characters: response.data, loading: false });
    } catch (err) {
      console.error('Failed to load characters:', err);
      this.setState({ 
        error: 'Failed to load characters. Is the backend running?',
        loading: false 
      });
    }
  };

  handleFilterChange = (e) => {
    this.setState({ filter: e.target.value }, this.loadCharacters);
  };

  handleStatusChange = (e) => {
    this.setState({ statusFilter: e.target.value }, this.loadCharacters);
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      this.loadCharacters();
    }
  };

  handleCharacterClick = (character) => {
    // TODO: Navigate to character detail page
    console.log('Clicked character:', character);
    alert(`Character detail page not implemented yet!\n\nCharacter: ${character.name}`);
  };

  render() {
    const { characters, loading, error, filter, statusFilter, searchTerm } = this.state;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Characters</h1>
          <div style={styles.filters}>
            <input
              type="text"
              placeholder="Search characters..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={this.handleSearchChange}
              onKeyPress={this.handleSearchSubmit}
            />
            <select 
              style={styles.select} 
              value={filter}
              onChange={this.handleFilterChange}
            >
              <option value="all">All Characters</option>
              <option value="main">Main Characters</option>
              <option value="supporting">Supporting</option>
            </select>
            <select
              style={styles.select}
              value={statusFilter}
              onChange={this.handleStatusChange}
            >
              <option value="all">All Status</option>
              <option value="alive">Alive</option>
              <option value="deceased">Deceased</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <div style={styles.loading}>Loading characters...</div>
        ) : (
          <div style={styles.grid}>
            {characters.length === 0 ? (
              <div style={styles.noResults}>
                No characters found. Try adjusting your filters!
              </div>
            ) : (
              characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onClick={this.handleCharacterClick}
                />
              ))
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Characters;
