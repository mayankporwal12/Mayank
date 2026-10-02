import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDemoReply } from './demo-responses.js';

test('answers basic arithmetic locally without eval or a network call', () => {
  assert.match(buildDemoReply('What is 24 divided by 6 plus 2?'), /24 \/ 6 \+ 2 = 6/);
});

test('routes Class 12 physics questions asked in Hinglish', () => {
  const reply = buildDemoReply('Class 12 physics ke numericals samjhao');
  assert.match(reply, /Class 12 ki padhai/);
  assert.match(reply, /Physics/);
  assert.match(reply, /SI units/);
});

test('routes Devanagari Class 12 chemistry questions', () => {
  const reply = buildDemoReply('कक्षा 12 में रसायन विज्ञान की अभिक्रियाएँ समझाओ');
  assert.match(reply, /कक्षा 12 की पढ़ाई/);
  assert.match(reply, /रसायन विज्ञान/);
  assert.match(reply, /परमाणु/);
});

test('returns a known local physics formula', () => {
  assert.match(buildDemoReply('Ohm law formula kya hai?'), /V = IR/);
});

test('gives a local coding example in English and Hinglish', () => {
  assert.match(buildDemoReply('Write hello world in Python'), /print\("Hello, world!"\)/);
  assert.match(buildDemoReply('Python mein hello world code likho'), /print\("Hello, world!"\)/);
});

test('offers practical business idea guidance', () => {
  const reply = buildDemoReply('Business idea batao');
  assert.match(reply, /Business ideas/);
  assert.match(reply, /paanch logon/);
});

test('handles greetings and thanks as casual conversation', () => {
  assert.match(buildDemoReply('नमस्ते, कैसे हो?'), /मैं ठीक हूँ/);
  assert.match(buildDemoReply('Thanks!'), /You’re welcome/);
  assert.match(buildDemoReply('Main pareshan hoon'), /kaafi heavy lag raha hoga/);
});

test('routes a general English why question without pretending to verify facts', () => {
  const reply = buildDemoReply('Why is the sky blue?');
  assert.match(reply, /General question/);
  assert.match(reply, /cause, the process, and the result/);
  assert.match(reply, /local demo/);
});