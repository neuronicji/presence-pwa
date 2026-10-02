# Somnus Presence v0.11

A calm, local manual/demo face for a stationary landscape display. This revision is based on Presence main `b7e4700`. Somnus voice and session integration are deferred: there is no microphone, camera, backend, credential handling or telemetry.

## Try it locally

Serve this directory over localhost (for example `python -m http.server 8000`) and open `http://localhost:8000/` in Chrome or Edge. Directly opening index.html also displays the face, but service workers require localhost or HTTPS. Tap the small upper-left dot to open controls; Escape or the close button closes them. Keys 1–6 select Sleep, Attend, Listen, Think, Speak and Acknowledge. Gaze sliders and Center gaze remain available; AUTO DEMO cycles expressions and a manual state selection stops it. Touching the page requests fullscreen where supported; the page remains usable if that request fails.

To try on a Galaxy S24, use a locally hosted HTTPS origin reachable by the phone or a separately authorized private deployment. A phone connecting to a notebook's plain HTTP LAN address can display the face, but cannot install or exercise its service worker. No public deployment is included.

## Revision

- Softer eye whites and shallow shading, irises enlarged from 7.3vw to 9.1vw (about 25%), cleaner relaxed openings.
- Curious asymmetric THINK with a subtle upward side gaze; modestly more open, still LISTEN.
- Amber speaking accents just beneath the eyes, hidden state labels in normal view, controls explicitly marked manual/demo.
- Accessible state buttons, inert hidden controls, focus restoration, and reduced motion for blinking, gaze motion, speaking accents and acknowledgement.
- Document title, controls and manifest use Somnus Presence v0.11. PWA start URL and scope stay `./`; no new manifest ID or public URL. Cache is `presence-v0.11` and activation removes only older Presence caches.

## Verification

See the review package's evidence/results.json and before/after PNGs. Desktop Chromium rendering was reviewed at 915×412 (S24-like landscape CSS viewport) and 1440×900. This is viewport emulation, not Galaxy S24 hardware validation. Device installation, Android browser chrome, physical touchscreen behavior and actual Somnus integration remain untested. No repository push, merge or public deployment occurred.
