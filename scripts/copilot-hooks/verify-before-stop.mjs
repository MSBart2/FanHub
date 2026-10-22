#!/usr/bin/env node
// Stop hook: the agent may finish only when the Node frontend Jest suite passes.
// Blocks with the failing output, gives up after MAX_BLOCKS, and logs every decision.
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MAX_BLOCKS = 3;

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  input = {};
}

const cwd = input.cwd || process.cwd();
const root = execSync('git rev-parse --show-toplevel', { cwd, encoding: 'utf8' }).trim();
const loopDir = path.join(root, '.copilot-loop');
fs.mkdirSync(loopDir, { recursive: true });

const sessionId = input.sessionId || 'unknown';
const counterFile = path.join(loopDir, `stop-blocks-${sessionId}.json`);
const logFile = path.join(loopDir, 'hook-log.jsonl');
const blocks = fs.existsSync(counterFile) ? JSON.parse(fs.readFileSync(counterFile, 'utf8')).blocks : 0;

const frontend = path.join(root, 'node', 'frontend');
const started = Date.now();
const run = spawnSync('npx react-scripts test --watchAll=false', {
  cwd: frontend,
  shell: true,
  encoding: 'utf8',
  env: { ...process.env, CI: 'true' },
  maxBuffer: 20 * 1024 * 1024,
});
const output = `${run.stdout || ''}\n${run.stderr || ''}`;
const passed = run.status === 0;
const testsLine = (output.match(/^Tests:.*$/m) || ['Tests: (no summary)'])[0].trim();

function log(decision, note) {
  fs.appendFileSync(
    logFile,
    JSON.stringify({
      time: new Date().toISOString(),
      sessionId,
      agent: input.agentName || 'main',
      branch: execSync('git branch --show-current', { cwd: root, encoding: 'utf8' }).trim(),
      decision,
      blocksSoFar: blocks,
      tests: testsLine,
      seconds: Math.round((Date.now() - started) / 1000),
      note,
    }) + '\n',
  );
}

if (passed) {
  log('allow', 'suite passed');
  process.stdout.write(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
}

if (blocks >= MAX_BLOCKS) {
  const note = `Stop hook gave up after ${MAX_BLOCKS} blocked stops. Suite still failing: ${testsLine}`;
  fs.writeFileSync(path.join(loopDir, `escalation-${sessionId}.md`), `# Escalation\n\n${note}\n\n\`\`\`\n${output.slice(-4000)}\n\`\`\`\n`);
  log('allow-escalated', note);
  process.stdout.write(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
}

fs.writeFileSync(counterFile, JSON.stringify({ blocks: blocks + 1 }));
const failures = output
  .split('\n')
  .filter((line) => /●|✕|FAIL|Expected|Received|Error/.test(line))
  .slice(0, 40)
  .join('\n');
const reason = [
  `Stop hook (block ${blocks + 1} of ${MAX_BLOCKS}): the Node frontend suite is failing, so the loop contract is not met.`,
  testsLine,
  'Failing output:',
  failures || output.slice(-3000),
  'Route the failure to implementer (source bug) or test-writer (test bug), rerun the suite, then finish.',
].join('\n');
log('block', testsLine);
process.stdout.write(JSON.stringify({ decision: 'block', reason }));
