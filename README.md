# Somnus Presence v0.11

A calm, local manual/demo face for a stationary landscape display. This revision is based on Presence main `b7e4700`. Somnus voice and session integration are deferred: there is no microphone, camera, backend, credential handling or telemetry.

## Try it locally

Serve this directory over localhost (for example `python -m http.server 8000`) and open `http://localhost:8000/` in Chrome or Edge. Directly opening index.html also displays the face, but service workers require localhost or HTTPS. Tap the small upper-left dot to open controls; Escape or the close button closes them. Keys 1–6 select Sleep, Attend, Listen, Think, Speak and Acknowledge. Gaze sliders and Center gaze remain available; AUTO DEMO cycles expressions and a manual state selection stops it. Touching the page requests fullscreen where supported; the page remains usable if that request fails.

To try on a Galaxy S24, use a locally hosted HTTPS origin reachable by the phone or a separately authorized private deployment. A phone connecting to a notebook's plain HTTP LAN address can display the face, but cannot install or exercise its service worker. The live app is https://neuronicji.github.io/presence-pwa/.

## Fullscreen exit follow-up (v0.11)

The bottom-right **Exit fullscreen** button is always reachable without opening controls. It exits browser-requested fullscreen where supported, then shows a brief reminder to use the phone's system Home gesture or button. An installed PWA's manifest fullscreen/standalone display cannot be closed by this API; the button explains that limitation. The button does not navigate to or claim to open Android's launcher.

After Exit fullscreen or a native fullscreen exit, ordinary touches keep the page out of fullscreen. Open expression controls and choose **Enter fullscreen** to return deliberately. Fullscreen state follows browser fullscreen-change events. Unsupported APIs and rejected requests show a brief hint without breaking face controls or demo playback. User-facing version stays v0.11; changed assets use cache `presence-v0.11-r2`.

## Revision

- Softer eye whites and shallow shading, irises enlarged from 7.3vw to 9.1vw (about 25%), cleaner relaxed openings.
- Curious asymmetric THINK with a subtle upward side gaze; modestly more open, still LISTEN.
- Amber speaking accents just beneath the eyes, hidden state labels in normal view, controls explicitly marked manual/demo.
- Accessible state buttons, inert hidden controls, focus restoration, and reduced motion for blinking, gaze motion, speaking accents and acknowledgement.
- Document title, controls and manifest use Somnus Presence v0.11. PWA start URL and scope stay `./`; no new manifest ID or public URL. Cache is `presence-v0.11-r2` and activation removes only older Presence caches.

## Verification

See the review package's evidence/results.json and before/after PNGs. Desktop Chromium rendering was reviewed at 915×412 (S24-like landscape CSS viewport) and 1440×900. This is viewport emulation, not Galaxy S24 hardware validation. Device installation, Android browser chrome, physical touchscreen behavior and actual Somnus integration remain untested. The visual revision and fullscreen exit follow-up are published through the existing GitHub Pages site.
