import { createEngine } from './core/engine.js';
import { createInput } from './input/touch.js';
import { createGame } from './game/game.js';
import { createPanels } from './ui/panels.js';

const canvas = document.getElementById('game');
const ui = {
  hp: document.getElementById('hp'),
  lv: document.getElementById('lv'),
};

// Panels (Inventory/Craft)
const panels = createPanels({
  shade: document.getElementById('shade'),
  inv: document.getElementById('panelInv'),
  craft: document.getElementById('panelCraft'),
  btnInv: document.getElementById('btnInv'),
  btnCraft: document.getElementById('btnCraft'),
});

// Input (joystick + attack)
const input = createInput({
  pad: document.getElementById('pad'),
  stick: document.getElementById('stick'),
  btnAttack: document.getElementById('btnAttack'),
});

// Game state
const game = createGame({ input, ui, panels });

// Engine (resize + loop)
const engine = createEngine({ canvas, onTick: game.tick, onResize: game.resize });
engine.start();

// Expose small debug helpers (optional)
window.__oni = { engine, game, input, panels };
