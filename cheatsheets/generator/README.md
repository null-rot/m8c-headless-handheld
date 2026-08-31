# M8 Controller Cheat Sheet Generator

A no-backend web app that generates a **personalized** M8 shortcuts cheat sheet: pick
which button on your handheld each M8 function sits on, see a live preview, and
**Print / Save PDF**. Built for [m8c](https://github.com/laamaa/m8c) on retro handhelds
(muOS / Anbernic etc.), but works for any controller.

## Use it locally
No build step - just serve the folder and open it:

```bash
cd cheatsheets && python -m http.server 8080
```
Then open <http://localhost:8080/generator/>.

## How it works
- **`pad.js`** draws a full gamepad (every control) and `applyPadConfig()` assigns the M8
  functions (EDIT / OPTION / SHIFT / PLAY / QUIT) onto whichever controls you pick, so the
  highlight system lights up *your* buttons. D-pad = directions (fixed).
- **`data.js`** is the shortcut set (M8 firmware 6.5+), from
  [cengebretson/M8Guide](https://github.com/cengebretson/M8Guide).
- **`render.js`** builds the 3-column sheet and generates the "Your Controls" legend from
  your bindings.
- **`sheet.css`** styles the printable sheet (US Letter, landscape); **`app.css`** styles
  the configurator UI.
- Your mapping is saved to `localStorage` and encoded in the URL
  (`?edit=a&option=b&shift=select&play=start&quit=l1`) - **Copy shareable link** hands
  someone else your exact setup.

## Publish it on GitHub Pages
1. Put this `cheatsheets` folder in a repo you own.
2. Copy `generator/deploy-pages.yml.example` to `.github/workflows/pages.yml`.
3. Repo → Settings → Pages → Source: **GitHub Actions**.
4. Push. Your generator will be at `https://<you>.github.io/<repo>/generator/`.

Paths are all relative (`../fonts`), so the generator works wherever the folder lives, as
long as `generator/` and `fonts/` stay siblings.

## Printing
Landscape, **US Letter**, margins **None/Minimum**, Scale **100%**, Background Graphics
**ON**, Headers/Footers **OFF**. `@media print` hides the form and prints only the sheet.

## Credits
Shortcut data & layout after [LaurentVitalis/M8Guide](https://github.com/LaurentVitalis/M8Guide)
and [cengebretson/M8Guide](https://github.com/cengebretson/M8Guide); see `../README.md`.
