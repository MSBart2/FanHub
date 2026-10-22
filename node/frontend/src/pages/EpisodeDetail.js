import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { episodesApi } from "../services/api";

const styles = {
  container: { padding: "1rem 0" },
  section: { marginTop: "1.5rem" },
  overview: { display: "flex", flexWrap: "wrap", gap: "1.5rem" },
  thumbnail: {
    width: "320px",
    maxWidth: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    borderRadius: "8px",
    background: "#2a2a2a",
  },
  placeholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ccc",
  },
  content: { flex: "1 1 240px", minWidth: 0 },
  metadata: {
    display: "grid",
    gridTemplateColumns: "max-content minmax(0, 1fr)",
    gap: "0.5rem 1rem",
    marginTop: "1rem",
    overflowWrap: "anywhere",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
    gap: "1rem",
    listStyle: "none",
  },
  portrait: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    background: "#2a2a2a",
    marginBottom: "0.5rem",
  },
  quotes: { listStyle: "none", display: "grid", gap: "1rem" },
};

const hasValue = (value) =>
  value !== null && value !== undefined && value !== "";

function formatAirDate(value) {
  // Parsing YYYY-MM-DD as a Date would move it to the prior day in some zones.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function EpisodeDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState({
    id: null,
    status: "loading",
    episode: null,
    failedImages: {},
  });

  useEffect(() => {
    let active = true;
    // Clear all previous content, errors, and image failures on route changes.
    setDetail({ id, status: "loading", episode: null, failedImages: {} });

    async function loadEpisode() {
      try {
        const response = await episodesApi.getById(id);
        if (!active) return;
        const body = response.data;
        if (
          body?.success !== true ||
          !body.data ||
          typeof body.data !== "object" ||
          Array.isArray(body.data)
        ) {
          throw new Error("Invalid episode response");
        }
        setDetail({
          id,
          status: "ready",
          episode: body.data,
          failedImages: {},
        });
      } catch (error) {
        if (!active) return;
        setDetail({
          id,
          status: error.response?.status === 404 ? "not-found" : "error",
          episode: null,
          failedImages: {},
        });
      }
    }

    loadEpisode();
    // Each effect owns its guard, including StrictMode's setup/cleanup cycle.
    return () => {
      active = false;
    };
  }, [id]);

  // Do not flash the previous episode before the new route's effect runs.
  const current = detail.id === id ? detail : { status: "loading" };
  const { episode, status } = current;

  const markImageFailed = (imageKey) => {
    setDetail((previous) =>
      previous.id === id && previous.status === "ready"
        ? {
            ...previous,
            failedImages: { ...previous.failedImages, [imageKey]: true },
          }
        : previous,
    );
  };

  const renderImage = (src, alt, imageKey, style, fallback) =>
    src && !current.failedImages[imageKey] ? (
      <img
        key={`${id}:${imageKey}:${src}`}
        src={src}
        alt={alt}
        style={style}
        onError={() => markImageFailed(imageKey)}
      />
    ) : (
      <div style={{ ...style, ...styles.placeholder }}>{fallback}</div>
    );

  return (
    <div style={styles.container}>
      <Link to="/episodes">← Back to episodes</Link>

      {status === "loading" && (
        <div className="card" style={styles.section} role="status">
          Loading episode...
        </div>
      )}
      {status === "not-found" && (
        <div className="card" style={styles.section}>
          <h1>Episode not found</h1>
          <p>The requested episode could not be found.</p>
        </div>
      )}
      {status === "error" && (
        <div className="card" style={styles.section} role="alert">
          <h1>Unable to load episode</h1>
          <p>Failed to load episode. Please try again later. Is the backend running?</p>
        </div>
      )}
      {status === "ready" && (
        <>
          <section className="card" style={{ ...styles.section, ...styles.overview }}>
            {renderImage(
              episode.thumbnail_url,
              `Thumbnail for ${episode.title || "this episode"}`,
              "thumbnail",
              styles.thumbnail,
              "No episode image available.",
            )}
            <div style={styles.content}>
              <h1>{episode.title || "Untitled episode"}</h1>
              <p>{episode.show_title || "Show unavailable"}</p>
              <dl style={styles.metadata}>
                {hasValue(episode.season_number) && (
                  <>
                    <dt>Season</dt>
                    <dd>{episode.season_number}</dd>
                  </>
                )}
                {hasValue(episode.season_title) && (
                  <>
                    <dt>Season title</dt>
                    <dd>{episode.season_title}</dd>
                  </>
                )}
                {hasValue(episode.episode_number) && (
                  <>
                    <dt>Episode</dt>
                    <dd>{episode.episode_number}</dd>
                  </>
                )}
                {hasValue(episode.air_date) && (
                  <>
                    <dt>Air date</dt>
                    <dd>
                      <time dateTime={episode.air_date}>
                        {formatAirDate(episode.air_date)}
                      </time>
                    </dd>
                  </>
                )}
                {hasValue(episode.runtime_minutes) && (
                  <>
                    <dt>Runtime</dt>
                    <dd>{episode.runtime_minutes} min</dd>
                  </>
                )}
                {hasValue(episode.director) && (
                  <>
                    <dt>Director</dt>
                    <dd>{episode.director}</dd>
                  </>
                )}
                {hasValue(episode.writer) && (
                  <>
                    <dt>Writer</dt>
                    <dd>{episode.writer}</dd>
                  </>
                )}
                {hasValue(episode.rating) && (
                  <>
                    <dt>Rating</dt>
                    <dd>{episode.rating}/10</dd>
                  </>
                )}
              </dl>
            </div>
          </section>

          <section className="card" style={styles.section}>
            <h2 className="section-title">Description</h2>
            <p>{episode.description || "No description available."}</p>
          </section>

          <section style={styles.section}>
            <h2 className="section-title">Characters</h2>
            {Array.isArray(episode.characters) && episode.characters.length > 0 ? (
              <ul style={styles.grid}>
                {episode.characters.map((character) => (
                  <li className="card" key={character.id}>
                    {renderImage(
                      character.image_url,
                      `Portrait of ${character.name || "unknown character"}`,
                      `character:${character.id}`,
                      styles.portrait,
                      "No image",
                    )}
                    <h3>{character.name || "Unknown character"}</h3>
                    {hasValue(character.actor_name) && <p>Played by {character.actor_name}</p>}
                    {(character.is_featured === true || character.is_featured === 1) && (
                      <p>Featured character</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="card">No characters listed for this episode.</p>
            )}
          </section>

          <section style={styles.section}>
            <h2 className="section-title">Quotes</h2>
            {Array.isArray(episode.quotes) && episode.quotes.length > 0 ? (
              <ul style={styles.quotes}>
                {episode.quotes.map((quote, index) => (
                  <li className="card" key={quote.id ?? index}>
                    <blockquote>
                      <p>{quote.quote_text}</p>
                      <footer>— {quote.character_name || "Unknown speaker"}</footer>
                    </blockquote>
                    {hasValue(quote.context) && <p>Context: {quote.context}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="card">No quotes listed for this episode.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default EpisodeDetail;
