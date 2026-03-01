export function createPanels({ shade, inv, craft, btnInv, btnCraft }){
  let open = null; // 'inv' | 'craft' | null

  function show(which){
    open = which;
    shade.style.display = 'block';
    inv.style.display = which === 'inv' ? 'block' : 'none';
    craft.style.display = which === 'craft' ? 'block' : 'none';
  }

  function hide(){
    open = null;
    shade.style.display = 'none';
    inv.style.display = 'none';
    craft.style.display = 'none';
  }

  function toggle(which){
    if(open === which) hide();
    else show(which);
  }

  // Click outside or close button
  shade.addEventListener('pointerdown', hide);
  ;[inv, craft].forEach(p => {
    p.addEventListener('pointerdown', (e) => {
      // prevent shade close when clicking inside
      e.stopPropagation();
    });
    p.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', hide));
  });

  btnInv.addEventListener('click', () => toggle('inv'));
  btnCraft.addEventListener('click', () => toggle('craft'));

  // Public API used by game
  return {
    isOpen: () => open !== null,
    which: () => open,
    show,
    hide,
    toggle,
  };
}
