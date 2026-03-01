export function createInput({ pad, stick, btnAttack }){
  const input = {
    moveX: 0,
    moveY: 0,
    attacking: false,
  };

  // Joystick
  let activeId = null;
  let cx = 0, cy = 0;

  function setStick(dx, dy){
    const r = 44; // max radius
    const len = Math.hypot(dx, dy);
    const k = len > r ? r / len : 1;
    const sx = dx * k;
    const sy = dy * k;

    stick.style.transform = `translate(calc(-50% + ${sx}px), calc(-50% + ${sy}px))`;

    input.moveX = sx / r;
    input.moveY = sy / r;
  }

  function resetStick(){
    activeId = null;
    stick.style.transform = 'translate(-50%,-50%)';
    input.moveX = 0;
    input.moveY = 0;
  }

  pad.addEventListener('pointerdown', (e) => {
    activeId = e.pointerId;
    pad.setPointerCapture(activeId);
    const rect = pad.getBoundingClientRect();
    cx = rect.left + rect.width/2;
    cy = rect.top + rect.height/2;
    setStick(e.clientX - cx, e.clientY - cy);
  });

  pad.addEventListener('pointermove', (e) => {
    if(activeId !== e.pointerId) return;
    setStick(e.clientX - cx, e.clientY - cy);
  });

  pad.addEventListener('pointerup', (e) => {
    if(activeId !== e.pointerId) return;
    resetStick();
  });

  pad.addEventListener('pointercancel', (e) => {
    if(activeId !== e.pointerId) return;
    resetStick();
  });

  // Attack button
  const setAtk = (v) => { input.attacking = v; };
  btnAttack.addEventListener('pointerdown', (e) => { e.preventDefault(); setAtk(true); });
  btnAttack.addEventListener('pointerup',   () => setAtk(false));
  btnAttack.addEventListener('pointercancel', () => setAtk(false));

  return input;
}
