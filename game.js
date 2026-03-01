export function createGame({ input, ui, panels }){
  const state = {
    w: 0,
    h: 0,
    t: 0,
    lv: 1,
    hp: 100,
    player: { x: 160, y: 240, r: 10, spd: 140 },
    cam: { x: 0, y: 0 },
  };

  function resize(w, h){
    state.w = w;
    state.h = h;
  }

  function tick(dt, engine){
    state.t += dt;

    // If a panel is open, freeze movement (UI shouldn’t disappear)
    const frozen = panels?.isOpen?.() ?? false;

    if(!frozen){
      const p = state.player;
      const mx = input.moveX;
      const my = input.moveY;
      const len = Math.hypot(mx, my);
      const nx = len > 0.001 ? mx / len : 0;
      const ny = len > 0.001 ? my / len : 0;
      p.x += nx * p.spd * dt;
      p.y += ny * p.spd * dt;

      // Simple bounds
      p.x = clamp(p.x, 40, 2000);
      p.y = clamp(p.y, 40, 2000);

      // Attack drains HP slightly just to show UI updates
      if(input.attacking){
        state.hp = Math.max(0, state.hp - 10 * dt);
      } else {
        state.hp = Math.min(100, state.hp + 3 * dt);
      }
    }

    ui.hp.textContent = String(Math.round(state.hp));
    ui.lv.textContent = String(state.lv);

    draw(engine.ctx);
  }

  function draw(ctx){
    const { w, h } = state;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#0b0b0b';
    ctx.fillRect(0, 0, w, h);

    // Camera centers player
    const p = state.player;
    const camX = p.x - w/2;
    const camY = p.y - h/2;

    // Grid
    ctx.save();
    ctx.translate(-camX, -camY);
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = '#ffffff';
    for(let x=0; x<=2000; x+=80){
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,2000); ctx.stroke();
    }
    for(let y=0; y<=2000; y+=80){
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(2000,y); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Player (simple oni)
    ctx.fillStyle = '#b00000';
    ctx.fillRect(p.x-12, p.y-14, 24, 28);
    // horns
    ctx.fillStyle = '#f2e6b5';
    ctx.fillRect(p.x-10, p.y-20, 6, 10);
    ctx.fillRect(p.x+4, p.y-20, 6, 10);
    // eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(p.x-6, p.y-4, 4, 4);
    ctx.fillRect(p.x+2, p.y-4, 4, 4);

    // Sword
    ctx.fillStyle = '#eaeaea';
    ctx.fillRect(p.x+10, p.y-18, 4, 30);
    ctx.fillStyle = '#8a4b00';
    ctx.fillRect(p.x+9, p.y+12, 6, 4);

    // Attack FX
    if(state.hp > 0 && state.t && (window.__oni?.input?.attacking || false)){
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 42, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    // Simple dev text
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = '12px system-ui';
    ctx.fillText('Clean V4 · touch joystick + panels (inventory/craft) · no global spaghetti', 10, h - 10);
  }

  return { resize, tick, state };
}

function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
