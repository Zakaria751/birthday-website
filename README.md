# 🎂 Happy Birthday Saloma ❤️ — Interactive Birthday Card

A tiny interactive "birthday movie" built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build tools, no backend. Made to be deployed for free on GitHub Pages.

## 1. Project overview

The site plays through five scenes, one at a time, like chapters in a short film:

1. **Intro** — a hand-built CSS cake, candles that light one by one, and a hand-drawn pink heart with "Happiest of birthdays to you ya a7la saloma 💗" appearing right inside it.
2. **Gift + message** — a wrapped gift the person taps to open, followed by a birthday message revealed line by line.
3. **Memories** — your videos and photos, each with a little caption, ending in a "More randoms" gallery.
4. **Final scene** — `last.jpeg` shown big, a single-candle cake, and the closing message.
5. **Credits** — "Made by Zeko ❤️", with a soft heartbeat animation.

A persistent music control sits in the bottom-right corner across every scene, and the background song loops forever once it starts.

## 2. Project structure

```
/
├── index.html
├── style.css
├── script.js
├── images/
│   ├── aww.jpeg, 1.jpeg, 2.jpeg, 3.jpeg, ... , last.jpeg   (see images/README.txt)
├── videos/
│   └── 1.mp4 … 9.mp4                                        (see videos/README.txt)
├── Audio/
│   └── Birthday song.mp3                                    (see Audio/README.txt)
└── README.md
```

The site works even if some of these files don't exist yet — missing photos/videos are quietly removed instead of showing a broken icon, and a missing music file just disables the music button gracefully. Nothing breaks.

## 3. How to add the videos

See `videos/README.txt` for the exact 9 filenames and which caption goes with each one. Just drop the `.mp4` files in — the captions are already wired up in `script.js` (`STORY.videos`).

## 4. How to add the photos

See `images/README.txt` for the exact filenames. Numbered photos that aren't explicitly listed there are picked up automatically into the "More randoms of zeko's best person" gallery at the end — no extra setup needed, just name them `<number>.jpeg`.

## 5. How to add the background music

See `Audio/README.txt`. Put the file at `./Audio/Birthday song.mp3` (a few other extensions are also accepted as fallback, in case it ends up saved differently).

## 6. How to edit any of the text

- The intro's heart message, and the birthday headline/message, live in `index.html` inside `#intro-scene` and `#birthday-scene`.
- Video/photo captions live in `STORY` at the top of `script.js`.
- The final scene's closing lines live in `index.html`, inside `#final-scene` (`.final-line` elements).
- The credits line lives in `index.html`, inside `#credits-scene`.

Feel free to rewrite any of these — just keep each line inside its own element (`.story-line`, `.final-line`, etc.) so the line-by-line reveal animation keeps working.

## 7. How to customize colors

All colors are defined once, at the top of `style.css`, as CSS custom properties (`--pink-1`, `--lavender`, etc). Change these and the whole site updates — cake, heart, gift, buttons, glow effects.

## 8. How to publish using GitHub Pages

1. Create a new repository on GitHub (e.g. `happy-birthday`).
2. Upload all the files in this project, keeping the folder structure exactly as-is.
3. In the repository, go to **Settings → Pages**.
4. Under **Source**, choose the `main` branch and the `/ (root)` folder, then save.
5. Wait a minute or two, then visit:

```
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

All asset paths in this project are relative (`./images/...`, `./videos/...`, `./Audio/...`), so it works correctly whether it's hosted at the root of a domain or inside a subdirectory.

## Notes on accessibility & performance

- Respects `prefers-reduced-motion` — large animations, floating particles, and the cursor sparkle are all disabled or shortened automatically.
- The cursor-follow sparkle only runs on non-touch devices.
- No external JS frameworks or libraries — just three lightweight files.

Made with 💗 for someone who deserves the best birthday.
