# Porting notes: Nord on Spotify 1.3.x

State as of 2026-11-15, tested on Spotify 1.3.9.2055 with Spicetify 2.46.7 (Windows, free account).

## Working (verified in the live client)

- Startup, cold start, all main pages (home, Liked Songs, playlist, album, artist, search, lyrics, podcast, preferences).
- Window controls cover, colours, full-page banner, lyrics page, cards, track lists (incl. selected and playing row), player bar.
- Settings menu: cog, Immersive View button and close button with real mouse clicks.
- Colour schemes: select, create, edit with live preview, save, delete; all four dynamic colour modes.
- Custom font and font size, window-controls editor, every banner option, banner repositioning by scroll wheel.
- Snippets: Minimalistic Library X, hover timestamp, hide home recommendations, hide similar songs,
  hide page details, hide Liked Songs, centred lyrics.
- Shortcuts: Quick Search (Ctrl+Space) and Search (Ctrl+/), on and off. Right-click cog to reload.
- Backup to clipboard or file, restore from clipboard or file, Reset Settings.

## Removed because Spotify no longer supports them

- "Stock UI" mode and the Library X / Stock switch.
- Auto Expand Library X (the Home/Search box it hid moved to the top bar).
- Redo shortcut (sp://desktop/v1/redo is gone).

## Still to do

1. **Fork-dependent files.** `manifest.json`, `install-scripts/*`, the README and the "Like on GitHub" /
   "How to Reposition Banners" / Discord links still point at Tetrax-10. Update once the fork exists.
   The README also still advertises Stock UI support.
2. **Add-on integrations** (`theme/src/third-parties/`): Lyrics Plus, Beautiful Lyrics, Marketplace cards,
   New Releases, Sort by Play Count, Playlist Filter, Sleep Timer. None were installed, so none were checked.
3. **What's New page** (`/content-feed`) and the **friend activity panel**: only base colours apply.
   What's New has generated class names only.
4. **Remaining dead selectors.** The last audit had ~470 of ~616 selectors matching nothing; many only apply
   with a snippet on or a popup open, but the rest need porting. Lists are produced by
   `dev/tools/audit.js` + `dev/tools/analyze.cjs` (local, git-ignored).
5. **Player bar details:** like-button colour and the dots under active shuffle/repeat.
6. **Lyrics page:** blur on non-active lines (no stable hook for individual lines).
7. **Untested:** macOS and Linux, Premium accounts, the "Hide Windows Controls" on/off toggle itself,
   `Change Page's Banner On Song Change` switched off, colour scheme import/export via clipboard.
8. **Build tooling:** CI still uses Node 16 and spicetify-creator 1.0.13; `npm run build-repo` must be run
   before committing so `Nord/` holds the current build.

## Things learned

- Spotify's top bar and some page elements are window drag regions. Anything clickable placed over them
  needs `-webkit-app-region: no-drag`, and scripted `.click()` calls do not reveal the problem; test with
  real mouse clicks.
- `Spicetify.React` / `ReactDOM` are undefined when the bundle is first evaluated; look them up lazily
  (`src/shims/react.js`).
- Stable hooks that worked: `data-encore-id`, `data-testid`, `aria-selected`, and
  `[style*="--lyrics-color-active"]` for the lyrics page. Spicetify's `css-map.json` is out of date for 1.3.9.
- Mousetrap only replaces a binding when the combo text matches exactly (`mod+/`, not `ctrl+/`).
