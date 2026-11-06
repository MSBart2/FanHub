const assert = require('node:assert/strict');
const { test } = require('node:test');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

test('A1: SQLite native binary loads and preserves parameterized queries and transactions', () => {
  const db = new Database(':memory:');
  try {
    db.pragma('foreign_keys = ON');
    assert.equal(db.pragma('foreign_keys', { simple: true }), 1);
    db.exec('CREATE TABLE checks (id INTEGER PRIMARY KEY, value TEXT NOT NULL)');
    const insert = db.prepare('INSERT INTO checks (value) VALUES (?)');
    const insertAll = db.transaction(values => {
      for (const value of values) insert.run(value);
    });

    insertAll(['first', "second's value"]);
    assert.deepEqual(
      db.prepare('SELECT value FROM checks ORDER BY id').all(),
      [{ value: 'first' }, { value: "second's value" }]
    );
    assert.throws(() => insertAll(['rolled back', null]), /NOT NULL/);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM checks').get().count, 2);
  } finally {
    db.close();
  }
});

test('A2: bcrypt native binary hashes and verifies passwords asynchronously', async () => {
  const hash = await bcrypt.hash('install-smoke-password', 10);
  assert.equal(bcrypt.getRounds(hash), 10);
  assert.equal(await bcrypt.compare('install-smoke-password', hash), true);
  assert.equal(await bcrypt.compare('wrong-password', hash), false);
});
