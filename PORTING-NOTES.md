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

1. **Add-on integrations** (`theme/src/third-parties/`): Lyrics Plus, Beautiful Lyrics, Marketplace cards,
   New Releases, Sort by Play Count, Playlist Filter, Sleep Timer. None were installed, so none were checked.
2. **What's New page** (`/content-feed`): the feed was empty on the test account, so its rows could not be
   inspected or restyled. The Listening activity (friends) panel is done.
3. **Remaining dead selectors.** Latest audit (`node dev/tools/audit.mjs` then `node dev/tools/analyze.cjs`,
   both local and git-ignored): 178 of 652 selectors match. Visual sweep of home, playlist, album, artist, discography,
   search, genre, podcast, lyrics, Quick Search, context menu and the friends panel found nothing else broken. Most of
   the remaining dead selectors are for UI Spotify removed (old sidebar rootlist, cover-art expand buttons, settings
   page equaliser), for add-ons that aren't installed (Marketplace, Lyrics Plus, etc.), or for snippet/popup states
   the audit can't open (Keyboard Shortcuts modal, confirm dialogs). They are harmless but could be deleted once the
   add-on integrations are checked.
4. **Untested:** macOS and Linux, Premium accounts. `Change Page's Banner On Song Change` was only checked
   with a simulated song change, not real playback.

## Done since the first pass

- CI: one `Build` workflow on `main` (Node 26 LTS) lints, runs `npm run build-repo` and fails if the committed `Nord/`
  differs from the build. The old `dist` deploy and auto-format commits are gone. Still run `npm run build-repo`
  before committing.
- Fork links: manifest, install scripts, README, issue template and the settings menu links (Like on GitHub,
  How to Reposition Banners, custom font tutorial) point at syoong81/Nord-Spotify `main`. Discord and Stock UI
  sections removed from the README. Verified in the live client.

- Progress bar sized and coloured through Spotify's own variables (`--progress-bar-height` etc.).
- Player bar: bare play button, no dots under active buttons, shuffle coloured when on. The like button keeps
  the scheme accent colour.
- Lyrics: non-active lines are blurred again. `src/features/lyricsBlur` learns the active line's generated
  class at runtime (the only opaque line) and injects the rule; unsynced lyrics are left sharp.
- Hide Windows Controls on/off, colour scheme export/import via clipboard: tested, working.
- Nord Dynamic: all four modes tested. "Dark Vibrant" currently gives the same colour as "Atmosphere" because
  `Spicetify.colorExtractor` returns null on 1.3.9 and the mode falls back to Spotify's extracted colours (left as is).

- Search category chips (also on What's New), context menu, playlist filter box, playlist header creator link,
  Quick Search box, confirm dialogs: selectors repointed to current hooks.
- Full-banner headers: short titles no longer wrap mid-word; Spotify's doubled "•" separator is hidden.

## Things learned

- Spotify's top bar and some page elements are window drag regions. Anything clickable placed over them
  needs `-webkit-app-region: no-drag`, and scripted `.click()` calls do not reveal the problem; test with
  real mouse clicks.
- `Spicetify.React` / `ReactDOM` are undefined when the bundle is first evaluated; look them up lazily
  (`src/shims/react.js`).
- Stable hooks that worked: `data-encore-id`, `data-testid`, `aria-selected`, and
  `[style*="--lyrics-color-active"]` for the lyrics page. Spicetify's `css-map.json` is out of date for 1.3.9.
- Mousetrap only replaces a binding when the combo text matches exactly (`mod+/`, not `ctrl+/`).
- Chromium freezes CSS transitions and throttles timers while the Spotify window is hidden or covered
  (`document.visibilityState === "hidden"`). Computed colours then read as their pre-transition value, and
  scripted tests with waits can stall. Keep the window visible, or set `transition: none` before measuring.
- Git Bash rewrites arguments that start with "/" into Windows paths, so `node goto.mjs /genre/...` navigates to
  `/C:/Program Files/Git/genre/...`. Export `MSYS_NO_PATHCONV=1` before passing routes.
- An occasional "Something went wrong" right after a reload comes from Spotify's home-chips module racing
  Spicetify's wrapper (`Cannot read properties of undefined (reading 'call')`); a second reload clears it.
