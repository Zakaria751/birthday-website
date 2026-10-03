/* =========================================================
   BIRTHDAY WEBSITE — SCRIPT
   A tiny interactive birthday movie.
   ========================================================= */

/* -----------------------------------------------------------
   CONFIG — edit these to personalize the whole site.
   ----------------------------------------------------------- */
const CONFIG = {

  friendName: "Saloma",

  // start date used to auto-calculate the live friendship day counter below
  friendshipStart: "2023-09-29",

  friendImage: "./images/last.jpeg",

  music: "./Audio/Birthday song",

  cakeImage: "./images/cake.png", // reserved for future use; the cake is currently hand-built in CSS

  candleCount: 5,

  heartMessage: "Happy birthday ya a7la saloma 💗",

  birthdayMessage: "Happy Birthday to you, my most precious person in the world! 💗"
};

/* -----------------------------------------------------------
   STORY — videos + photos that make up the memories scene.
   Put your video files inside ./videos/  and photos inside ./images/
   Anything that fails to load is quietly removed, so it's safe to
   list files that aren't uploaded yet.
   ----------------------------------------------------------- */
const STORY = {
  videosFolder: "./videos/",
  imagesFolder: "./images/",

  videos: [
    { file: "1.MP4", caption: "Hi" },
    { file: "2.mp4", caption: "Since day 1" },
    { file: "8.mp4", caption: "To spend the most beautiful times together 💗" },
    { file: "3.mp4", caption: "Our only tiktok together" },
    { file: "4.mp4", caption: "Best times spent together" },
    { file: "5.mp4", caption: "And silliest times together" },
    { file: "6.mp4", caption: "To get creativity out of me 💗" },
    { file: "9.mp4", caption: "meow meow kitty" },
    { file: "7.mp4", caption: "Spain was amazed by your beauty awww" },
    { file: "awww.mp4", caption: "The silliest yet the cutest you in another universe" },
    { file: "you in another universe.mp4", caption: "A random cat i filmed yet it reminds me of you if u were a cat" }
  ],

  // groups of photos that share one caption
  photoGroups: [
    { files: ["aww.jpeg"], caption: "Awww saloma is so sad… LETS CHANGE THAT FROWN INTO A SMILE" },
    { files: ["1.jpeg", "2.jpeg", "10.jpeg"], caption: "To more happy moments together" },
    { files: ["3.jpeg", "15.jpeg"], caption: "for more sleepy lomy lomy salomy" },
    { files: ["5.jpeg", "17.jpeg", "18.jpeg", "19.jpeg"], caption: "she is so pretty that her soul refuses to let go of her beauty" },
    { files: ["lol.jpeg"], caption: "Look how pretty and silly you are 💗" },
    { files: ["20.jpeg"], caption: "My most gorgeous divorced dad 😅" },
    { files: ["21.jpeg", "22.jpeg"], caption: "THE PRETTIEST TO EVER TOUCH THE LANDS OF SPAIN" },
    { files: ["23.jpeg"], caption: "Literally me" }
  ],

  // any numbered photo not used above falls into this closing grid.
  // it tries 1.jpeg .. randomsMaxIndex.jpeg and silently skips missing ones,
  // so raise randomsMaxIndex if there end up being more than this many photos.
  randomsTitle: "More randoms of zeko's best person",
  randomsMaxIndex: 40,

  // shown big on the final scene, after "One more thing…"
  lastImage: "last.jpeg"
};

/* -----------------------------------------------------------
   GAME — the little yes/no game between memories and the final scene.
   Put these 4 photos inside ./images/ with exactly these names.
   ----------------------------------------------------------- */
const GAME = {
  folder: "./images/",
  start: "up1.jpg",       // first photo, with the "What is it ?" button
  question: "up.jpg",     // photo shown with the Yes / No choice
  sure: "sure.jpg",       // photo shown after the first "No"
  love: "love.jpg",       // photo shown after "Yes"
  growStep: 0.3           // how much "Yes" grows each time "No" runs away
};

/* -----------------------------------------------------------
   GLOBAL STATE
   ----------------------------------------------------------- */
const state = {
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  isTouch: matchMedia("(pointer: coarse)").matches || "ontouchstart" in window,
  currentScene: "intro-scene",
  musicStarted: false
};

/* =========================================================
   INIT
   ========================================================= */
function init(){
  buildCandles();
  buildMemoryCards();
  wireImageFallbacks();
  initMusic();
  initInteractions();
  initCursorSparkle();
  initLightbox();
  createFloatyField(document.getElementById("floatyFieldBirthday"), 14);
  createFloatyField(document.getElementById("floatyFieldFinal"), 6);
  createFloatyField(document.getElementById("floatyFieldGame"), 8);

  // scene navigation
  document.getElementById("continueBtn").addEventListener("click", () => transitionToScene("memories-scene"));
  document.getElementById("toFinalBtn").addEventListener("click", () => transitionToScene("game-scene"));

  initGift();
  initGame();
  initFinalTapToContinue();
  initIntroTapToContinue();
  initDaysCounter();

  requestAnimationFrame(() => initIntro());
}

/* =========================================================
   SCENE 1 — INTRO SEQUENCE
   ========================================================= */
function initIntro(){
  const stage = document.querySelector(".stage");
  const heartMessage = document.getElementById("heartMessage");
  const subtitle = document.getElementById("introSubtitle");

  const t = state.reducedMotion
    ? { start: 100, cakeDur: 50, candleGap: 60, heartDelay: 100, wishDelay: 200, exitDelay: 900 }
    : { start: 500, cakeDur: 1300, candleGap: 420, heartDelay: 650, wishDelay: 900, exitDelay: 3200 };

  if (subtitle){
    setTimeout(() => subtitle.classList.add("show"), state.reducedMotion ? 80 : 150);
  }

  setTimeout(() => {
    stage.classList.add("cake-in");
    animateCake();
  }, t.start);

  setTimeout(() => {
    lightCandles(t.candleGap);
  }, t.start + t.cakeDur * 0.55);

  const candlesTotalTime = CONFIG.candleCount * t.candleGap;

  setTimeout(() => {
    drawHeart(stage);
  }, t.start + t.cakeDur * 0.55 + candlesTotalTime * 0.4);

  setTimeout(() => {
    showWishMessage(heartMessage);
  }, t.start + t.cakeDur * 0.55 + candlesTotalTime + t.heartDelay + t.wishDelay);

  // no auto-advance here — the person taps/clicks anywhere to move on
  setTimeout(() => {
    const hint = document.getElementById("introTapHint");
    if (hint) hint.classList.add("show");
  }, t.start + t.cakeDur * 0.55 + candlesTotalTime + t.heartDelay + t.wishDelay + t.exitDelay);
}

// tapping/clicking anywhere on the intro scene advances to the birthday scene
function initIntroTapToContinue(){
  const scene = document.getElementById("intro-scene");
  if (!scene) return;
  scene.addEventListener("click", () => {
    if (state.currentScene === "intro-scene"){
      transitionToScene("birthday-scene");
    }
  });
}

function animateCake(){
  // handled purely via the .cake-in class + CSS keyframes (see style.css)
}

function buildCandles(){
  const wrap = document.getElementById("candles");
  wrap.innerHTML = "";
  for (let i = 0; i < CONFIG.candleCount; i++){
    const c = document.createElement("div");
    c.className = "candle";
    c.innerHTML = '<span class="flame"></span>';
    wrap.appendChild(c);
  }
}

function lightCandles(gap){
  const candles = document.querySelectorAll(".candle");
  candles.forEach((candle, i) => {
    setTimeout(() => {
      candle.classList.add("lit");
      spawnMiniSparkle(candle);
    }, i * gap);
  });
}

function spawnMiniSparkle(anchorEl){
  if (state.reducedMotion) return;
  const rect = anchorEl.getBoundingClientRect();
  const spark = document.createElement("div");
  spark.className = "p-spark";
  const size = 3 + Math.random() * 3;
  spark.style.cssText = `
    width:${size}px;height:${size}px;
    left:${rect.left + rect.width / 2}px;
    top:${rect.top}px;
    position:fixed;
    z-index:40;
    opacity:0.9;
    animation: sparkPop 900ms ease-out forwards;
  `;
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 950);
}

// inject one small keyframe for mini sparkle pops (kept in JS since it's a one-off utility)
(function injectSparkPopKeyframe(){
  const style = document.createElement("style");
  style.textContent = `
    @keyframes sparkPop {
      0% { transform: translate(-50%,-50%) scale(0.4); opacity: 0.9; }
      100% { transform: translate(-50%, calc(-50% - 24px)) scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

function drawHeart(stage){
  stage.classList.add("draw-heart");
  const drawDur = state.reducedMotion ? 50 : 2600;
  setTimeout(() => {
    stage.classList.add("fill-heart");
    scatterHeartSparkles();
  }, drawDur * 0.72);
}

function scatterHeartSparkles(){
  if (state.reducedMotion) return;
  const holder = document.querySelector(".heart-sparkles");
  const count = 10;
  for (let i = 0; i < count; i++){
    const s = document.createElement("span");
    s.textContent = Math.random() > 0.5 ? "✨" : "•";
    const angle = (i / count) * Math.PI * 2;
    const radius = 40 + Math.random() * 18;
    const x = 50 + Math.cos(angle) * radius;
    const y = 46 + Math.sin(angle) * radius * 0.9;
    s.style.cssText = `
      position:absolute; left:${x}%; top:${y}%;
      font-size:${8 + Math.random() * 8}px;
      color:#fff1f7;
      opacity:0;
      animation: heartSparkleIn 1.4s ease-out ${i * 70}ms forwards;
    `;
    holder.appendChild(s);
  }
}
(function injectHeartSparkleKeyframe(){
  const style = document.createElement("style");
  style.textContent = `
    @keyframes heartSparkleIn {
      0% { opacity: 0; transform: scale(0.3) translateY(6px); }
      35% { opacity: 1; }
      100% { opacity: 0; transform: scale(1) translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
})();

function showWishMessage(wishText){
  wishText.classList.add("show");
  // stays visible — no longer auto-hides
}

/* =========================================================
   SCENE TRANSITION SYSTEM
   ========================================================= */
function transitionToScene(sceneId){
  if (state.currentScene === sceneId) return;

  const current = document.getElementById(state.currentScene);
  const next = document.getElementById(sceneId);
  if (!current || !next) return;

  current.classList.add("leaving");
  current.classList.remove("active");

  // small overlap so the outgoing scene finishes its blur-out while the next fades in
  setTimeout(() => {
    current.classList.remove("leaving");
  }, 1100);

  requestAnimationFrame(() => {
    next.classList.add("active");
  });

  state.currentScene = sceneId;

  // trigger scene-specific reveal choreography
  if (sceneId === "birthday-scene") revealBirthdayScene();
  if (sceneId === "memories-scene") revealMemoriesScene();
  if (sceneId === "game-scene") revealGameScene();
  if (sceneId === "final-scene") revealFinalScene();
  if (sceneId === "credits-scene") revealCreditsScene();
}

/* =========================================================
   SCENE 2 — GIFT
   ========================================================= */
function initGift(){
  const btn = document.getElementById("giftBtn");
  let opened = false;
  btn.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    openGift(btn);
  });
}

function openGift(btn){
  btn.classList.add("opened");
  btn.setAttribute("aria-label", "Gift opened");
  burstFromGift();

  const showDelay = state.reducedMotion ? 100 : 750;
  setTimeout(() => {
    showBirthdayMessage();
  }, showDelay);
}

function burstFromGift(fieldId = "burstField"){
  const field = document.getElementById(fieldId);
  if (!field) return;
  const glyphs = ["💗", "✨", "💫", "🌟", "💖"];
  const count = state.reducedMotion ? 6 : 18;

  for (let i = 0; i < count; i++){
    const el = document.createElement("span");
    el.className = "burst-item";
    el.textContent = glyphs[i % glyphs.length];

    const angle = (Math.PI / count) * i * 2 + (Math.random() * 0.4 - 0.2);
    const distance = 70 + Math.random() * 90;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - 40;

    el.style.setProperty("--burst-x", `${x}px`);
    el.style.setProperty("--burst-y", `${y}px`);
    el.style.setProperty("--burst-rot", `${(Math.random() * 60 - 30)}deg`);
    el.style.setProperty("--burst-size", `${14 + Math.random() * 12}px`);
    el.style.setProperty("--burst-dur", `${0.9 + Math.random() * 0.6}s`);
    el.style.setProperty("--burst-delay", `${Math.random() * 0.15}s`);

    field.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }
}

function showBirthdayMessage(){
  const block = document.getElementById("messageBlock");
  block.classList.add("show");

  const lines = document.querySelectorAll(".story-line");
  const baseDelay = state.reducedMotion ? 60 : 420;
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("show"), 500 + i * baseDelay);
  });
}

function revealBirthdayScene(){
  // gift + message choreography is user-driven (tap to open),
  // but we make sure the hint is visible and floaty field is alive.
}

/* =========================================================
   SCENE 3 — MEMORIES
   ========================================================= */
/* -----------------------------------------------------------
   LIVE FRIENDSHIP COUNTER
   Recalculates from CONFIG.friendshipStart every second, so the
   days/hours/minutes/seconds are always live and accurate —
   never edit the numbers by hand, only friendshipStart above.
   ----------------------------------------------------------- */
function initDaysCounter(){
  const daysEl = document.getElementById("counterDays");
  const hoursEl = document.getElementById("counterHours");
  const minsEl = document.getElementById("counterMins");
  const secsEl = document.getElementById("counterSecs");
  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const start = new Date(CONFIG.friendshipStart + "T00:00:00");

  function pad(n){ return String(n).padStart(2, "0"); }

  function tick(){
    const diffMs = Date.now() - start.getTime();
    if (isNaN(diffMs) || diffMs < 0) return;

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = days;
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}

function buildMemoryCards(){
  const grid = document.getElementById("memoryGrid");
  grid.innerHTML = "";

  STORY.videos.forEach((v) => grid.appendChild(buildVideoBlock(v)));
  STORY.photoGroups.forEach((g) => grid.appendChild(buildPhotoGroupBlock(g)));
  grid.appendChild(buildRandomsBlock());
}

function buildVideoBlock(v){
  const el = document.createElement("article");
  el.className = "memory-card memory-card--video";

  el.innerHTML = `
    <div class="story-media">
      <video src="${STORY.videosFolder}${v.file}" playsinline muted controls preload="metadata"></video>
    </div>
    <p class="story-caption">${v.caption}</p>
  `;

  const video = el.querySelector("video");
  const audio = document.getElementById("background-music");

  video.addEventListener("play", () => {
    video.muted = true;

    if (state.musicStarted && audio.paused) {
      audio.play().catch(() => {});
    }
  });

  video.addEventListener("pause", () => {
    if (state.musicStarted && audio.paused) {
      audio.play().catch(() => {});
    }
  });

  video.addEventListener("ended", () => {
    if (state.musicStarted && audio.paused) {
      audio.play().catch(() => {});
    }
  });

  video.addEventListener("error", () => el.remove(), { once: true });

  return el;
}

function buildPhotoGroupBlock(g){
  const el = document.createElement("article");
  el.className = "memory-card memory-card--photos";
  const photosHtml = g.files.map((f) => `
    <div class="story-photo">
      <img src="${STORY.imagesFolder}${f}" alt="" loading="lazy" />
    </div>
  `).join("");

  el.innerHTML = `
    <div class="story-photo-grid">${photosHtml}</div>
    <p class="story-caption">${g.caption}</p>
  `;

  wirePhotoFallbacks(el);
  return el;
}

function buildRandomsBlock(){
  const el = document.createElement("article");
  el.className = "memory-card memory-card--randoms";

  const usedNumbers = new Set();
  STORY.photoGroups.forEach((g) => g.files.forEach((f) => {
    const n = parseInt(f, 10);
    if (!Number.isNaN(n)) usedNumbers.add(n);
  }));

  let thumbsHtml = "";
  for (let i = 1; i <= STORY.randomsMaxIndex; i++){
    if (usedNumbers.has(i)) continue;
    thumbsHtml += `
      <div class="story-photo story-photo--thumb">
        <img src="${STORY.imagesFolder}${i}.jpeg" alt="" loading="lazy" />
      </div>
    `;
  }

  el.innerHTML = `
    <h3 class="randoms-title">${STORY.randomsTitle}</h3>
    <div class="story-photo-grid story-photo-grid--randoms">${thumbsHtml}</div>
  `;

  wirePhotoFallbacks(el);
  return el;
}

// graceful fallback: if a photo fails to load, just remove that
// one tile instead of leaving a broken image icon.
// also makes every photo tap/click-able to open full-size.
function wirePhotoFallbacks(scope){
  scope.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      const tile = img.closest(".story-photo");
      if (tile) tile.remove();
    }, { once: true });

    const tile = img.closest(".story-photo");
    if (tile){
      tile.setAttribute("role", "button");
      tile.setAttribute("tabindex", "0");
      tile.setAttribute("aria-label", "View photo full size");
      tile.addEventListener("click", () => openLightbox(img.src));
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          openLightbox(img.src);
        }
      });
    }
  });
}

/* =========================================================
   LIGHTBOX — tap any memory photo to view it full size
   ----------------------------------------------------------- */
function initLightbox(){
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");
  if (!lightbox || !closeBtn) return;

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

function openLightbox(src){
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  if (!lightbox || !img) return;
  img.src = src;
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox(){
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  if (!lightbox) return;
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  if (img) setTimeout(() => { img.src = ""; }, 300);
}

function revealMemoriesScene(){
  const cards = document.querySelectorAll(".memory-card");
  const baseDelay = state.reducedMotion ? 30 : 90;
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add("show"), 200 + i * baseDelay);
  });

  const closingLine = document.getElementById("closingLine");
  setTimeout(() => closingLine.classList.add("show"), 200 + cards.length * baseDelay + 400);
}

/* =========================================================
   SCENE 3.5 — LITTLE GAME
   What is it ? -> Yes / No -> (No -> sure.jpg -> No runs away,
   Yes keeps growing) -> Yes -> love.jpg + message + Continue
   ========================================================= */
function revealGameScene(){
  // nothing to choreograph — the scene is fully user-driven
}

function initGame(){
  const scene = document.getElementById("game-scene");
  const inner = document.getElementById("gameInner");
  const frame = document.getElementById("gameFrame");
  const img = document.getElementById("gameImg");
  const overlay = document.getElementById("gameOverlay");
  const whatBtn = document.getElementById("whatBtn");
  const choice = document.getElementById("gameChoice");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const contBtn = document.getElementById("gameContinueBtn");
  if (!scene || !img || !whatBtn || !yesBtn || !noBtn) return;

  let stage = "start";      // start -> question -> sure -> love
  let dodges = 0;

  // preload every photo so swaps feel instant
  [GAME.start, GAME.question, GAME.sure, GAME.love].forEach((f) => {
    const pre = new Image();
    pre.src = GAME.folder + f;
  });

  // if a photo file is missing, show a soft placeholder instead of a broken icon
  img.addEventListener("error", () => frame.classList.add("is-missing"));
  img.addEventListener("load", () => frame.classList.remove("is-missing"));

  function setPhoto(file){
    const swapMs = state.reducedMotion ? 0 : 320;
    img.classList.add("swap");
    setTimeout(() => {
      img.src = GAME.folder + file;
      requestAnimationFrame(() => img.classList.remove("swap"));
    }, swapMs);
  }

  /* --- step 1: What is it ? --- */
  whatBtn.addEventListener("click", () => {
    if (stage !== "start") return;
    stage = "question";
    whatBtn.hidden = true;
    choice.hidden = false;
    setPhoto(GAME.question);
  });

  /* --- Yes: the happy ending --- */
  yesBtn.addEventListener("click", () => {
    if (stage !== "question" && stage !== "sure") return;
    stage = "love";
    choice.hidden = true;
    setPhoto(GAME.love);
    setTimeout(() => {
      overlay.classList.add("show");
      burstFromGift("gameBurstField");
      contBtn.hidden = false;
    }, state.reducedMotion ? 100 : 450);
  });

  /* --- No: first press -> sure.jpg, after that it runs away --- */
  noBtn.addEventListener("click", (e) => {
    if (stage === "question"){
      stage = "sure";
      setPhoto(GAME.sure);
      return;
    }
    if (stage === "sure"){
      e.preventDefault();
      dodge();           // caught it? it still escapes
    }
  });

  // mouse: it bolts as soon as the pointer gets near
  noBtn.addEventListener("pointerenter", (e) => {
    if (stage === "sure" && e.pointerType === "mouse") dodge();
  });
  // touch: it bolts the moment a finger lands on it
  noBtn.addEventListener("touchstart", (e) => {
    if (stage !== "sure") return;
    e.preventDefault();
    dodge();
  }, { passive: false });

  function dodge(){
    dodges++;
    moveNoButton();
    growYes();
  }

  function growYes(){
    const sceneRect = scene.getBoundingClientRect();
    const baseW = yesBtn.offsetWidth || 120;
    const baseH = yesBtn.offsetHeight || 48;
    // never let Yes outgrow the screen
    const maxByWidth = (sceneRect.width * 0.92) / baseW;
    const maxByHeight = (sceneRect.height * 0.6) / baseH;
    const grow = Math.min(1 + dodges * GAME.growStep, maxByWidth, maxByHeight);
    yesBtn.style.setProperty("--grow", grow.toFixed(2));
  }

  function overlaps(a, b, pad){
    return !(a.right + pad < b.left || a.left - pad > b.right ||
             a.bottom + pad < b.top || a.top - pad > b.bottom);
  }

  function moveNoButton(){
    const sceneRect = scene.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    const w = noBtn.offsetWidth;
    const h = noBtn.offsetHeight;
    const margin = 14;

    const minX = sceneRect.left + margin;
    const maxX = sceneRect.right - w - margin;
    const minY = sceneRect.top + margin + 8;
    const maxY = sceneRect.bottom - h - margin;
    if (maxX <= minX || maxY <= minY) return;

    const prev = noBtn.getBoundingClientRect();
    const music = document.getElementById("music-toggle");
    const musicRect = music ? music.getBoundingClientRect() : null;

    // pick a random spot that is away from where it was and doesn't hide behind the music button
    let x = minX, y = minY;
    for (let i = 0; i < 12; i++){
      x = minX + Math.random() * (maxX - minX);
      y = minY + Math.random() * (maxY - minY);
      const box = { left: x, top: y, right: x + w, bottom: y + h };
      const farEnough = Math.hypot(x - prev.left, y - prev.top) > 120;
      const clearOfMusic = !musicRect || !overlaps(box, musicRect, 10);
      if (farEnough && clearOfMusic) break;
    }

    // position relative to the game container (the button's offset parent)
    noBtn.classList.add("dodging");
    noBtn.style.left = (x - innerRect.left) + "px";
    noBtn.style.top = (y - innerRect.top) + "px";
  }

  /* --- Continue -> the "one more thing" scene --- */
  contBtn.addEventListener("click", () => transitionToScene("final-scene"));
}

/* =========================================================
   SCENE 4 — FINAL
   ========================================================= */
function revealFinalScene(){
  const lines = document.querySelectorAll(".final-line");
  const baseDelay = state.reducedMotion ? 80 : 700;
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("show"), 300 + i * baseDelay);
  });

  // no auto-advance here — the person taps/clicks anywhere to move on
  const hint = document.getElementById("finalTapHint");
  if (hint){
    const afterLastLine = 300 + lines.length * baseDelay;
    setTimeout(() => hint.classList.add("show"), afterLastLine + 500);
  }
}

// tapping/clicking anywhere on the final scene advances to the credits scene
function initFinalTapToContinue(){
  const scene = document.getElementById("final-scene");
  if (!scene) return;
  scene.addEventListener("click", () => {
    if (state.currentScene === "final-scene"){
      transitionToScene("credits-scene");
    }
  });
}

/* =========================================================
   SCENE 5 — CREDITS
   ========================================================= */
function revealCreditsScene(){
  const stage = document.getElementById("creditsHeartStage");
  const line = document.getElementById("creditsLine");
  if (!stage) return;

  const drawDelay = 250;
  const drawDur = state.reducedMotion ? 60 : 2600;
  const fillAt = drawDur * 0.72;

  setTimeout(() => stage.classList.add("draw-heart"), drawDelay);

  setTimeout(() => {
    stage.classList.add("fill-heart");
    scatterCreditsHeartSparkles();
  }, drawDelay + fillAt);

  setTimeout(() => {
    stage.classList.add("pulse");
  }, drawDelay + fillAt + (state.reducedMotion ? 60 : 500));

  setTimeout(() => {
    line && line.classList.add("show");
  }, drawDelay + fillAt + (state.reducedMotion ? 100 : 900));
}

function scatterCreditsHeartSparkles(){
  if (state.reducedMotion) return;
  const holder = document.getElementById("creditsHeartSparkles");
  if (!holder) return;
  const count = 10;
  for (let i = 0; i < count; i++){
    const s = document.createElement("span");
    s.textContent = Math.random() > 0.5 ? "✨" : "•";
    const angle = (i / count) * Math.PI * 2;
    const radius = 40 + Math.random() * 18;
    const x = 50 + Math.cos(angle) * radius;
    const y = 46 + Math.sin(angle) * radius * 0.9;
    s.style.cssText = `
      position:absolute; left:${x}%; top:${y}%;
      font-size:${8 + Math.random() * 8}px;
      color:#fff1f7;
      opacity:0;
      animation: heartSparkleIn 1.4s ease-out ${i * 70}ms forwards;
    `;
    holder.appendChild(s);
  }
}

/* =========================================================
   IMAGE FALLBACKS (graceful degradation for missing assets)
   ========================================================= */
function wireImageFallbacks(){
  const photo = document.getElementById("friendPhoto");
  if (!photo) return;
  photo.addEventListener("error", () => {
    photo.classList.add("is-missing");
  }, { once: true });
}

/* =========================================================
   FLOATING HEARTS / SPARKLES — natural, not random
   Uses a fixed lane system with slight per-item jitter so motion
   reads as designed choreography rather than scattered noise.
   ----------------------------------------------------------- */
function createFloatyField(container, density){
  if (!container || state.reducedMotion) return;

  const glyphs = ["heart", "spark", "heart", "spark", "heart"];
  const laneCount = density;
  const laneWidth = 100 / laneCount;

  for (let i = 0; i < laneCount; i++){
    const el = document.createElement("span");
    const isHeart = glyphs[i % glyphs.length] === "heart";
    el.className = "floaty-item";
    el.textContent = isHeart ? "💗" : "✨";
    el.setAttribute("aria-hidden", "true");

    // each lane gets a base position with small jitter, so items don't collide
    // in an obviously-random way but still feel organic
    const laneCenter = laneWidth * i + laneWidth / 2;
    const jitter = (Math.random() - 0.5) * laneWidth * 0.6;
    const leftPct = Math.min(96, Math.max(2, laneCenter + jitter));

    const size = isHeart ? (12 + (i % 3) * 4) : (6 + (i % 3) * 3);
    const duration = 14 + (i % 5) * 3.2;
    const delay = -(Math.random() * duration); // negative delay staggers start positions immediately
    const drift = (Math.random() - 0.5) * 60;
    const rot = (Math.random() - 0.5) * 40;
    const opacity = isHeart ? 0.35 + (i % 3) * 0.08 : 0.5 + (i % 3) * 0.1;

    el.style.cssText = `
      left:${leftPct}%;
      font-size:${size}px;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      --floaty-drift:${drift}px;
      --floaty-rot:${rot}deg;
      --floaty-op:${opacity};
    `;
    container.appendChild(el);
  }
}

/* =========================================================
   MUSIC
   ----------------------------------------------------------- */
function initMusic(){
  const audio = document.getElementById("background-music");
  const btn = document.getElementById("music-toggle");
  const icon = btn.querySelector(".music-toggle__icon");

  audio.volume = 0.55;

  // remember mute preference for this session only
  let muted = sessionStorage.getItem("bday-music-muted") === "true";

  const setIcon = (playing) => {
    icon.innerHTML = playing
      ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 18V6l11-2v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.5" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="16" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>`
      : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 18V6l11-2v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/><circle cx="6.5" cy="18" r="2.5" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="16" r="2.5" stroke="currentColor" stroke-width="1.6"/><line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  };

  const tryPlay = () => {
    if (muted) return;
    audio.play().then(() => {
      state.musicStarted = true;
      btn.classList.add("playing");
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", "Pause birthday music");
      setIcon(true);
    }).catch(() => {
      // autoplay blocked — that's fine, user can tap the button
    });
  };

  // start music on the very first user interaction anywhere on the page
  const startOnFirstInteraction = () => {
    if (!state.musicStarted && !muted){
      tryPlay();
    }
    document.removeEventListener("click", startOnFirstInteraction);
    document.removeEventListener("touchstart", startOnFirstInteraction);
    document.removeEventListener("keydown", startOnFirstInteraction);
  };
  document.addEventListener("click", startOnFirstInteraction, { once: true });
  document.addEventListener("touchstart", startOnFirstInteraction, { once: true, passive: true });
  document.addEventListener("keydown", startOnFirstInteraction, { once: true });

  setIcon(!muted);
  if (muted){
    btn.classList.add("muted");
    btn.setAttribute("aria-label", "Play birthday music");
  }

  btn.addEventListener("click", () => {
    if (audio.paused){
      muted = false;
      sessionStorage.setItem("bday-music-muted", "false");
      btn.classList.remove("muted");
      tryPlay();
    } else {
      audio.pause();
      muted = true;
      sessionStorage.setItem("bday-music-muted", "true");
      btn.classList.remove("playing");
      btn.classList.add("muted");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Play birthday music");
      setIcon(false);
    }
  });

  // graceful failure if the music file is missing/unsupported
  audio.addEventListener("error", () => {
    btn.classList.add("muted");
    btn.setAttribute("aria-label", "Music unavailable");
    btn.style.opacity = "0.5";
    btn.style.cursor = "default";
    btn.onclick = null;
  }, { once: true });
}

/* =========================================================
   MICRO-INTERACTIONS
   ----------------------------------------------------------- */
function initInteractions(){
  if (state.isTouch) return; // hover-based effects are desktop-only

  const hoverTargets = document.querySelectorAll(".continue-btn, .memory-card, .music-toggle");
  hoverTargets.forEach((el) => {
    let lastSpawn = 0;
    el.addEventListener("mousemove", (e) => {
      const now = performance.now();
      if (now - lastSpawn < 260) return; // throttle so we don't flood the DOM
      lastSpawn = now;
      spawnHoverHeart(e.clientX, e.clientY);
    });
  });
}

function spawnHoverHeart(x, y){
  if (state.reducedMotion) return;
  const el = document.createElement("span");
  el.className = "p-heart";
  el.textContent = "💗";
  el.style.cssText = `
    left:${x}px; top:${y}px;
    position:fixed;
    font-size:${10 + Math.random() * 4}px;
    z-index:60;
    opacity:0.85;
    animation: hoverHeartFloat 900ms ease-out forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}
(function injectHoverHeartKeyframe(){
  const style = document.createElement("style");
  style.textContent = `
    @keyframes hoverHeartFloat {
      0% { transform: translate(-50%,-50%) scale(0.5); opacity: 0.85; }
      100% { transform: translate(-50%, calc(-50% - 30px)) scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* =========================================================
   CURSOR SPARKLE (desktop only, disabled on touch + reduced motion)
   ----------------------------------------------------------- */
function initCursorSparkle(){
  if (state.isTouch || state.reducedMotion) return;

  const cursor = document.getElementById("cursorSparkle");
  let raf = null;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  let active = false;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!active){
      active = true;
      cursor.classList.add("active");
      loop();
    }
  }, { passive: true });

  function loop(){
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(loop);
  }
}

/* -----------------------------------------------------------
   KICKOFF
   ----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", init);