export function addOverlayText() {
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position:fixed; bottom:12%; left:5%;
    opacity:0; transition:opacity 1.5s ease;
    pointer-events:none;
    border-left:2px solid #ffcc66;
    padding-left:16px; z-index:10;
    font-family:'Inter',sans-serif;
  `
  overlay.innerHTML = `
    <div style="color:#fff;font-size:1.05rem;font-weight:300;
      letter-spacing:2px;margin-bottom:8px;">
      This is not just a portfolio — it's a journey.
    </div>
    <div style="color:#ffcc66;font-size:0.78rem;
      letter-spacing:3px;opacity:0.8;">
      Move toward the gate to begin.
    </div>
  `
  document.body.appendChild(overlay)
  setTimeout(() => overlay.style.opacity = '1', 800)
  setTimeout(() => overlay.style.opacity = '0', 5500)
  setTimeout(() => overlay.remove(), 7000)
}
