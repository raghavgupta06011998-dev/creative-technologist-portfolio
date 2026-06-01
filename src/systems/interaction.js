import * as THREE from 'three'

export function addHotspot(ctx, position, color, title, body, type = 'info') {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.035, 8, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 })
  )
  ring.position.set(position[0], 0.08, position[2])
  ring.rotation.x = Math.PI / 2
  ctx.villageGroup.add(ring)

  ctx.villageHotspots.push({
    ring,
    title,
    body,
    type,
    prompt: `Press E - ${title}`,
    position: new THREE.Vector3(...position)
  })
}

export function createVillageUi(ctx) {
  if (!ctx.interactionPrompt) {
    ctx.interactionPrompt = document.createElement('div')
    ctx.interactionPrompt.style.cssText = `
      position:fixed;left:50%;bottom:7%;transform:translateX(-50%);
      color:#fff4d6;background:rgba(16,18,19,0.68);
      border:1px solid rgba(255,226,163,0.38);border-radius:8px;
      padding:10px 14px;font:600 13px/1.2 system-ui,sans-serif;
      letter-spacing:0.4px;opacity:0;transition:opacity 180ms ease;
      pointer-events:none;z-index:20;backdrop-filter:blur(8px);
    `
    document.body.appendChild(ctx.interactionPrompt)
  }

  if (!ctx.interactionPanel) {
    ctx.interactionPanel = document.createElement('div')
    ctx.interactionPanel.style.cssText = `
      position:fixed;right:32px;bottom:32px;width:min(360px,calc(100vw - 40px));
      color:#f8f1df;background:rgba(18,20,20,0.78);
      border:1px solid rgba(255,226,163,0.35);border-radius:8px;
      padding:18px 18px 16px;font-family:system-ui,sans-serif;
      box-shadow:0 18px 50px rgba(0,0,0,0.32);
      opacity:0;transform:translateY(12px);transition:opacity 180ms ease,transform 180ms ease;
      pointer-events:none;z-index:21;backdrop-filter:blur(10px);
    `
    document.body.appendChild(ctx.interactionPanel)
  }
}

export function showInteractionPanel(ctx, hotspot) {
  if (!ctx.interactionPanel) return

  ctx.interactionPanel.innerHTML = `
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#ffd27a;margin-bottom:8px;">${hotspot.title}</div>
    <div style="font-size:15px;line-height:1.5;color:#fff8e8;">${hotspot.body}</div>
  `
  ctx.interactionPanel.style.opacity = '1'
  ctx.interactionPanel.style.transform = 'translateY(0)'
  clearTimeout(ctx.interactionPanel.hideTimer)
  ctx.interactionPanel.hideTimer = setTimeout(() => {
    ctx.interactionPanel.style.opacity = '0'
    ctx.interactionPanel.style.transform = 'translateY(12px)'
  }, 4200)
}

export function updateVillageInteractions(ctx) {
  ctx.currentInteraction = null
  let nearestDistance = Infinity
  const targetObject = ctx.drivingMode && ctx.car ? ctx.car : ctx.activeCharacter

  for (const hotspot of ctx.villageHotspots) {
    hotspot.ring.rotation.z += 0.02
    const distance = targetObject ? targetObject.position.distanceTo(hotspot.position) : Infinity
    hotspot.ring.material.opacity = distance < 4 ? 1 : 0.55

    if (distance < 3.2 && distance < nearestDistance) {
      nearestDistance = distance
      ctx.currentInteraction = hotspot
    }
  }

  if (!ctx.interactionPrompt) return
  if (ctx.currentInteraction) {
    ctx.interactionPrompt.textContent = ctx.currentInteraction.prompt
    ctx.interactionPrompt.style.opacity = '1'
  } else {
    ctx.interactionPrompt.style.opacity = '0'
  }
}

export function openHouseUI(ctx) {
  const panel = document.createElement('div')
  panel.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    width:400px;background:#111;color:#fff;padding:20px;
    border-radius:10px;z-index:100;
    font-family:sans-serif;
  `

  panel.innerHTML = `
    <h2 style="margin-bottom:10px">Your House</h2>
    <p>This is your creative space. Designer. Builder. Storyteller.</p>
    <button id="takeMapBtn" style="margin-top:15px;padding:10px;background:#ffcc66;border:none;cursor:pointer;">Take Map</button>
    <button id="closeBtn" style="margin-left:10px;padding:10px;">Close</button>
  `

  document.body.appendChild(panel)

  document.getElementById('takeMapBtn').onclick = () => {
    ctx.hasMap = true
    panel.remove()
  }

  document.getElementById('closeBtn').onclick = () => panel.remove()
}

export function handleInteraction(ctx) {
  if (!ctx.currentInteraction) return null

  if (ctx.currentInteraction.type === 'car') return 'car'

  if (ctx.currentInteraction.type === 'home') {
    openHouseUI(ctx)
    return 'home'
  }

  showInteractionPanel(ctx, ctx.currentInteraction)
  return ctx.currentInteraction.type
}
