const db = require('../database/connection');

async function universeContext(req, res, next) {
  const headerValue = req.get('X-Show-Slug');

  try {
    let result;

    if (headerValue) {
      const trimmedValue = headerValue.trim();

      if (/^-?\d+$/.test(trimmedValue)) {
        result = await db.query(
          `SELECT id, title
           FROM shows
           WHERE id = $1
           LIMIT 1`,
          [parseInt(trimmedValue, 10)]
        );
      } else {
        result = await db.query(
          `SELECT id, title
           FROM shows
           WHERE LOWER(REPLACE(title, ' ', '-')) = $1
           LIMIT 1`,
          [trimmedValue.toLowerCase()]
        );
      }
    }

    if (!result || result.rows.length === 0) {
      result = await db.query(
        `SELECT id, title
         FROM shows
         ORDER BY id ASC
         LIMIT 1`
      );
    }

    if (result.rows.length > 0) {
      req.universe = {
        id: result.rows[0].id,
        title: result.rows[0].title,
      };
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = universeContext;
