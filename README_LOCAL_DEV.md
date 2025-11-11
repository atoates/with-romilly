# Local Development

A quick guide to running the site locally for testing.

## Prerequisites
- Node.js 18+ installed (check with `node -v`).

## Install Dependencies
```
npm install
```

## Start a Local Server
Serve the static files from the project root:
```
npm start
```
This uses `http-server` on port `5173`.

Open your browser at:
```
http://localhost:5173/
```

If you need HTTPS for testing (service workers, etc.), first create or place test cert/key files at `scripts/dev-cert.pem` and `scripts/dev-key.pem` (self-signed), then run:
```
npm run start:https
```
> Note: HTTPS local start will warn unless you trust the self-signed cert.

## Image Optimization
Run the existing image optimization script:
```
npm run optimize:images
```

## Cache Busting / CSS Changes
Because the site is static, you may want to hard refresh when testing styles:
- macOS: `Cmd+Shift+R`

## Adding LightWidget Embed
In `about.html`, inside the `#instagram-feed` container, paste the iframe code from LightWidget.

## Troubleshooting
- If port 5173 is in use, change it in `package.json` start script or run:
  ```
  npx http-server -p 5500 -c-1
  ```
- If images do not load, check relative paths and case-sensitivity.

## Deployment
The site can be hosted via GitHub Pages or any static host. Ensure the same root-relative paths are valid on the hosting platform.

