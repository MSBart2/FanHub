#!/usr/bin/env node
// sessionStart hook: a fresh worktree has no node_modules. Link the main checkout's
// node/frontend/node_modules into the worktree so the Stop hook can run Jest.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  input = {};
}

const cwd = input.cwd || process.cwd();
const root = execSync('git rev-parse --show-toplevel', { cwd, encoding: 'utf8' }).trim();
const commonDir = path.resolve(root, execSync('git rev-parse --git-common-dir', { cwd: root, encoding: 'utf8' }).trim());
const mainCheckout = path.dirname(commonDir);

const target = path.join(mainCheckout, 'node', 'frontend', 'node_modules');
const link = path.join(root, 'node', 'frontend', 'node_modules');

if (path.resolve(mainCheckout) !== path.resolve(root) && !fs.existsSync(link) && fs.existsSync(target)) {
  fs.symlinkSync(target, link, 'junction');
}
process.stdout.write('{}');
