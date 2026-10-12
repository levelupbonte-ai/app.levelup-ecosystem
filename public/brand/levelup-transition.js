/*!
 * LevelUp signature transition: the editorial panel wipe, signed by hand.
 *
 * An ink panel with a thin accent edge sweeps up the screen, the word
 * "LevelUp" is written across it in one pen signature (L-e-v-e-l, a pen lift,
 * U, p, then an accent swash), and the panel continues upward to reveal the
 * next page. If the next page is ready early the pen hurries to finish; if it
 * is slow the signature completes and holds, and after a moment a quiet status
 * line ("Almost ready…") fades in at the foot of the panel.
 *
 * Motion budget: cover 240 ms, write ~640 ms (cut to ~170 ms once the page is
 * ready), reveal 260 ms. transform / opacity / stroke-dashoffset only, no
 * dependencies. The accent (panel edge, swash, progress hairline) is read from
 * the CSS variable --lu-edge when the host page defines it (the showcase sets
 * it to the colour of the section being entered) and falls back to LevelUp
 * violet everywhere else.
 *
 * One file for the whole ecosystem: the showcase (Next 15), LevelStudio
 * (Vite/React) and the dashboard (Next 16) can load this same module.
 * Integration notes: docs/levelup-transition.md
 *
 *   import { cover, reveal, play, go, intercept, revealOnLoad }
 *     from "https://levelup-ecosystem.com/brand/levelup-transition.js";
 *
 * Also exposed as `window.LevelUpTransition` once loaded.
 */

const config = {
  cover: 240, // ms, panel sweeping in
  reveal: 260, // ms, panel sweeping out
  edge: 6, // px, the accent edge leading (cover) / trailing (reveal) the panel
  hold: 20, // ms fully covered before cover() resolves
  write: 640, // ms, the pen writing "LevelUp" when the page is slow
  finish: 170, // ms, the pen hurrying to finish once the page is ready
  /** ms of holding (page still loading) before the status line fades in. */
  waitAfter: 1200,
  /** ms of holding before it switches to the second message. */
  waitLongAfter: 4000,
  /** Status lines, by language. */
  messages: {
    en: ["Almost ready…", "Still loading — thanks for your patience"],
    fr: ["Presque prêt…", "Toujours en cours — merci de votre patience"],
  },
  /** Panel colour; null = the page's --foreground (ink on light, paper on dark). */
  panel: null,
  /** Pen colour; null = the page's --background. */
  ink: null,
  /** Accent override; null = the page's --lu-edge, then LevelUp violet. */
  accent: null,
  /** Cookie domain used to hand the wipe over to another LevelUp app. */
  domain: null,
};

const VIOLET = "#8B5CF6";
const FALLBACK_PANEL = "#0E0E12";
const FALLBACK_INK = "#FAFAFD";

// The signature. Hand-authored pen path (control points -> centripetal
// Catmull-Rom -> pointed-pen width model), see docs/levelup-transition.md.
//   f: the inked shape (thick downstrokes, hairline upstrokes)
//   m: the centre line, revealed by an animated stroke-dashoffset mask
//   k: [time, distance] keyframes of the pen speed (slow in tight curves)
//   t: [start, length] on the write timeline (fractions)
const SIGNATURE = {"vb":[41.63,6.53,528.69,208.33],"strokes":[{"f":"M46.2 95.5Q56.5 72.9 58.9 68.3Q61.3 63.7 65.9 57Q70.5 50.2 75.4 44.5Q80.2 38.8 85.6 33.8Q91.1 28.8 94.1 26.6Q97.1 24.4 100.3 22.5Q103.4 20.5 106 19.3Q108.7 18 110.8 17.3Q112.8 16.7 115 16.3Q117.2 16 119.3 16.1Q121.4 16.2 123.1 17Q124.8 17.7 125.4 18.8Q126.1 19.9 126.6 22.8Q127.1 25.8 126.8 29Q126.5 32.2 117.7 57.6Q109 83 105.4 95.3Q101.8 107.6 97.7 122.8Q93.6 138 91.7 143.2Q89.8 148.4 88.4 150.7Q87 153 85.4 154.4Q83.9 155.9 82.1 157Q80.2 158.2 77.5 159.3Q74.8 160.3 72.7 160.6Q70.6 160.9 68.5 160.7Q66.4 160.5 63.6 159.7Q60.8 158.9 59 157.9Q57.1 156.9 56.2 156Q55.2 155 54.4 153.2Q53.6 151.4 53.5 149.3Q53.3 147.3 53.7 146.1Q54.1 144.8 54.9 143.8Q55.7 142.8 56.8 142Q57.9 141.3 62 139.7Q66.1 138.1 68.9 137.5Q71.8 137 74.7 136.9Q77.6 136.8 94.6 138.9Q111.7 141.1 115.5 141.2Q119.4 141.3 121.7 141Q124 140.7 127 139.8Q129.9 139 132 138Q134.1 137.1 136.7 135.4Q139.3 133.7 143 129.9Q146.8 126.1 153.6 117Q160.3 108 163.6 102.9Q166.8 97.8 169 92.9Q171.2 88.1 172 85.1Q172.8 82.1 172.7 80.5Q172.7 78.8 172.4 78.1Q172.1 77.3 171.2 75.9Q170.2 74.6 169 73.6Q167.7 72.7 166.2 72Q164.7 71.4 163 71.3Q161.3 71.3 159 72.1Q156.7 73 154.7 74.3Q152.6 75.6 150.8 77.2Q149 78.7 147.4 80.7Q145.9 82.6 144.7 84.7Q143.6 86.8 142.4 89.8Q141.2 92.7 139.7 98.8Q138.3 104.8 137.8 107.9Q137.4 111 137.2 114.2Q137.1 117.4 137.4 120Q137.6 122.5 138.1 124.2Q138.5 125.8 140.5 129.6Q142.4 133.3 144.1 135.2Q145.9 137.1 147.3 138.1Q148.7 139.1 151.2 140Q153.7 140.8 157.8 140.7Q161.9 140.6 165.7 139.6Q169.5 138.6 172.7 136.5Q176 134.4 178.8 131.8Q181.5 129.2 184 126.2Q186.4 123.3 193.6 111.9Q200.9 100.5 206.5 92.6Q212.1 84.7 214.7 82.2Q217.4 79.8 218.6 79.2Q219.9 78.5 221.1 78.4Q222.2 78.2 222.4 78.3Q222.7 78.5 222.8 84.3Q222.9 90.1 224 100.7Q225.1 111.2 226.7 121.1Q228.4 130.9 229.6 133.3Q230.8 135.7 232.2 137.1Q233.7 138.4 234.6 138.8Q235.5 139.3 236.6 139.4Q237.7 139.6 238.7 139.3Q239.7 139.1 241.1 137.9Q242.5 136.8 246.5 131.2Q250.5 125.7 257.3 114.9Q264.1 104.1 268 98.6Q271.8 93 274.1 90.2Q276.4 87.3 278.6 85.4Q280.7 83.4 283.2 82Q285.7 80.5 288.5 79.6Q291.2 78.7 293.4 78.5Q295.5 78.3 297.6 78.6Q299.6 78.9 300.7 79.5Q301.8 80.1 303.3 82.3Q304.9 84.5 305.4 85.9Q305.9 87.2 305.8 88.1Q305.8 88.9 305.5 89.9Q305.1 90.9 304 92.6Q302.9 94.3 301.4 95.7Q299.8 97.1 297.9 98Q296 98.8 285.7 100.8Q275.3 102.8 273 103.7Q270.6 104.5 269.2 105.6Q267.8 106.6 266.2 108.5Q264.5 110.4 263.4 112.7Q262.2 114.9 261.6 117.4Q261 119.9 260.9 122.5Q260.8 125 261.3 127.6Q261.7 130.2 263 132.7Q264.2 135.2 265.6 136.5Q266.9 137.9 269.3 139Q271.7 140.2 274.1 140.7Q276.5 141.2 279.7 141.2Q283 141.2 285.3 140.7Q287.6 140.2 290.5 139.2Q293.4 138.1 296.1 136.8Q298.8 135.4 301.4 133.8Q304 132.2 306.4 130.3Q308.8 128.4 313 124Q317.2 119.6 320.5 114.5Q323.9 109.5 327.5 102.9Q331.2 96.3 343.4 71.4Q355.6 46.5 360.2 37.8Q364.8 29.2 365.6 27Q366.3 24.8 366.6 21.7Q366.9 18.6 366.6 16.3Q366.2 13.9 365.1 12.6Q364.1 11.3 362.4 10.9Q360.8 10.5 358.4 10.9Q356 11.3 353.7 12.4Q351.3 13.5 350 14.7Q348.8 15.9 347.4 18Q346 20.1 345.1 22.3Q344.2 24.5 343.3 27.5Q342.4 30.6 341.8 33.7Q341.3 36.8 338.8 61.4Q336.3 86.1 334.8 98Q333.3 109.9 332.6 119.1Q331.9 128.3 332.1 130.1Q332.2 131.8 332.8 133.6Q333.3 135.4 334.8 137.7Q336.3 139.9 338.6 141.5Q340.9 143.1 342.7 143.4Q344.6 143.7 345.5 143.6Q346.4 143.5 348.7 142.5Q351 141.6 356.9 138.1Q362.7 134.5 366.4 131.8Q370 129.1 372.6 126.9Q375.2 124.6 375 124.4Q374.8 124.1 374.4 124.4Q373.9 124.6 363.3 131.4Q352.7 138.3 350.1 139.2Q347.4 140.2 346.3 140Q345.1 139.8 343.9 138.8Q342.6 137.8 341.2 135.3Q339.7 132.8 339.3 131.1Q339 129.4 339.6 120.1Q340.3 110.7 341.8 98.8Q343.3 86.9 345.4 65.2Q347.5 43.6 348.2 38.5Q348.9 33.5 350.6 27.4Q352.3 21.3 353.3 18.9Q354.3 16.5 355.7 15.2Q357.1 13.9 358.3 13.4Q359.6 12.9 360.8 12.8Q362.1 12.7 362.9 13.2Q363.8 13.7 364.3 15.5Q364.9 17.2 364.7 20.1Q364.6 23 363.8 25.7Q363 28.5 358.4 37Q353.8 45.6 341.6 70.5Q329.4 95.4 325.4 102.6Q321.4 109.7 318.1 114.6Q314.7 119.5 310.6 123.7Q306.4 127.9 304 129.6Q301.7 131.4 299.1 132.9Q296.6 134.3 293.9 135.6Q291.2 136.9 289.2 137.5Q287.1 138.2 285 138.4Q282.9 138.6 280.8 138.2Q278.8 137.7 276.4 136.5Q273.9 135.3 272.1 133.7Q270.3 132.1 269.5 130.7Q268.8 129.4 268.3 127Q267.8 124.6 267.9 122.6Q267.9 120.7 268.4 118.2Q269 115.7 270.2 112.6Q271.4 109.6 272.1 108.5Q272.9 107.4 273.9 106.6Q274.9 105.8 277.6 104.8Q280.3 103.9 289.9 102Q299.6 100 302.5 98.6Q305.4 97.2 307.4 95.7Q309.4 94.1 310.5 92.6Q311.6 91.1 311.9 90.1Q312.3 89.1 312.3 87Q312.3 84.9 311.1 82.4Q309.9 79.8 308.5 78.5Q307.2 77.2 306.4 76.7Q305.5 76.2 304.6 75.9Q303.7 75.5 301.9 75.3Q300.1 75.2 294.7 76.1Q289.3 77.1 286.4 78.2Q283.5 79.3 280.3 81.6Q277.2 83.8 275.1 86Q273 88.2 270.7 91.3Q268.4 94.3 264.6 99.9Q260.8 105.5 256.1 113.2Q251.4 120.8 248 125.7Q244.5 130.6 243.1 132.3Q241.7 134 240.2 134.8Q238.7 135.7 238.1 135.4Q237.6 135 236.9 133.7Q236.2 132.4 235.2 128.7Q234.2 125 233 116.9Q231.8 108.9 230.4 94.7Q229 80.5 228.3 78.6Q227.7 76.8 226.9 76Q226.1 75.1 225 74.6Q223.9 74.2 222.8 74.3Q221.7 74.4 220.2 75.2Q218.6 76.1 216.7 77.5Q214.9 79 212.2 81.8Q209.6 84.6 204 92.6Q198.4 100.6 191.6 111.4Q184.8 122.2 182.4 125Q180.1 127.8 178 129.9Q175.9 131.9 173.5 133.7Q171.2 135.4 168.6 136.5Q166 137.6 163.9 137.9Q161.7 138.1 159.6 137.8Q157.6 137.5 156.3 137Q155.1 136.5 153.6 135.4Q152.2 134.2 150.9 132.8Q149.6 131.4 148.2 129.2Q146.7 127.1 145.9 125.3Q145.1 123.6 144.7 121.7Q144.3 119.9 144.2 117.9Q144.1 115.9 144.4 112.4Q144.7 108.9 145.5 104.6Q146.3 100.4 147.5 96.2Q148.7 92.1 149.9 88.8Q151.2 85.6 152.5 83.2Q153.8 80.8 155.5 78.6Q157.3 76.4 158.9 75.2Q160.6 73.9 161.8 73.6Q163 73.3 164.2 73.6Q165.5 73.8 166.6 74.5Q167.8 75.1 168.7 76.1Q169.7 77 170.2 78.1Q170.7 79.3 170.6 81.3Q170.6 83.3 169.1 87.4Q167.6 91.5 165.2 96.1Q162.8 100.7 159 106.2Q155.2 111.7 149.7 118.8Q144.3 125.9 141.2 129Q138.1 132.1 135.6 133.7Q133.2 135.3 131.2 136.2Q129.2 137.1 127.1 137.7Q125 138.4 122.9 138.7Q120.8 139 118.6 138.9Q116.4 138.8 110.6 137.9Q104.7 136.9 92.7 135.7Q80.7 134.4 76.1 134.7Q71.5 134.9 67.1 136Q62.6 137.1 59.1 138.7Q55.6 140.4 54.4 141.4Q53.2 142.5 52.4 144Q51.7 145.4 51.5 147.1Q51.3 148.7 51.7 151Q52.1 153.4 52.9 154.8Q53.6 156.2 54.8 157.4Q55.9 158.5 58 159.6Q60.1 160.8 63 161.6Q66 162.5 69.1 162.7Q72.2 162.8 74.5 162.3Q76.8 161.8 80.4 160.4Q84 158.9 87.5 157Q90.9 155 92.7 153.2Q94.5 151.4 96.2 148.6Q97.9 145.9 99.3 142.2Q100.7 138.5 108.1 111.8Q115.6 85.1 124.6 58.7Q133.6 32.2 133.8 28.8Q134 25.4 133.9 23.7Q133.7 22 133.2 20.3Q132.6 18.6 131.5 16.9Q130.4 15.2 129.6 14.6Q128.8 13.9 126.9 13.4Q125 12.8 122.5 13Q119.9 13.1 116.1 13.9Q112.3 14.7 110.2 15.4Q108 16.1 105.2 17.5Q102.4 18.8 99.2 20.8Q96 22.8 92.9 25Q89.9 27.3 84.3 32.4Q78.7 37.5 73.4 43.8Q68 50.2 63.4 57.1Q58.8 64 54.3 73.6Q49.8 83.1 47.7 89.2L45.6 95.3Z","m":"M45.9 95.4Q53.7 76.6 57.1 69.9Q60.5 63.2 65.1 56.4Q69.7 49.6 75.1 43.3Q80.5 37.1 86.1 32.1Q91.7 27.1 98 23Q104.2 18.9 109.1 17.1Q114.1 15.3 117 15Q120 14.6 122.2 14.7Q124.4 14.9 126.3 16Q128.1 17.2 129 19.2Q130 21.1 130.3 24.1Q130.6 27.1 130.2 30Q129.8 33 121.1 58.5Q112.3 84.1 104.6 111.5Q96.9 138.9 95.6 142.4Q94.2 145.9 92.8 148.5Q91.3 151.2 89.8 152.8Q88.3 154.4 85.8 156.1Q83.4 157.8 79.9 159.4Q76.5 160.9 74.3 161.4Q72.1 161.8 69.2 161.7Q66.2 161.5 63.3 160.7Q60.5 159.8 58.5 158.8Q56.5 157.7 54.8 155.4Q53.1 153 52.7 150.8Q52.3 148.7 52.5 147.2Q52.6 145.7 53.3 144.4Q54 143.2 55.1 142.2Q56.2 141.2 60.3 139.4Q64.4 137.6 68 136.8Q71.7 135.9 75.4 135.8Q79.1 135.6 97 137.8Q114.9 140 117.9 140Q120.8 140.1 125.2 139.1Q129.6 138.1 134.1 135.5Q138.7 132.9 142.3 129.2Q146 125.4 151.9 117.7Q157.8 109.9 161.5 104.3Q165.2 98.6 167.2 94.6Q169.1 90.5 170.5 86.3Q171.8 82 171.5 79.8Q171.2 77.7 169.2 75.6Q167.2 73.5 165.1 72.9Q163 72.2 161.6 72.5Q160.1 72.8 158.2 73.9Q156.3 75.1 152.8 78.9Q149.3 82.8 147.1 87.6Q145 92.3 143.3 98.9Q141.7 105.4 141.1 110.6Q140.6 115.8 141.2 120.3Q141.8 124.7 144 128.6Q146.2 132.5 148.9 135Q151.7 137.5 154.5 138.4Q157.3 139.3 161.1 139.1Q164.8 138.9 167.6 138Q170.4 137 173.5 134.9Q176.5 132.7 181 127.7Q185.6 122.7 192.8 111.3Q200 99.9 205.7 92Q211.3 84 214 81.5Q216.7 78.9 219.3 77.6Q222 76.3 223.2 76.6Q224.4 77 225 78.2Q225.5 79.4 227 95.1Q228.5 110.7 230.2 120.4Q231.8 130 232.6 132Q233.5 134.1 234.4 135.2Q235.4 136.3 237.3 136.9Q239.2 137.4 240.4 136.6Q241.6 135.8 243.5 133.5Q245.4 131.2 254.8 116.8Q264.2 102.3 270.4 93.9Q276.7 85.5 279.1 83.6Q281.4 81.8 284 80.4Q286.7 79 289.6 78.2Q292.5 77.4 295.4 77.2Q298.4 76.9 301.2 77.7Q304 78.5 306 80.7Q307.9 82.9 308.5 85.7Q309.1 88.6 308.2 90.5Q307.2 92.5 305.1 94.6Q303 96.7 301 97.8Q299.1 98.9 288.1 101.2Q277.1 103.6 275.1 104.4Q273 105.2 270.4 107.8Q267.9 110.5 266.3 114.7Q264.7 118.8 264.5 121.8Q264.3 124.8 264.7 127Q265.1 129.2 266 131.2Q267 133.2 268 134.3Q269 135.4 270.9 136.6Q272.8 137.7 275.6 138.6Q278.5 139.5 280.7 139.7Q282.9 139.9 285.1 139.6Q287.4 139.2 292.9 136.9Q298.3 134.5 303.3 131.1Q308.2 127.7 312.3 123.3Q316.4 119 320.1 113.3Q323.8 107.7 343.9 68.3Q363.9 28.9 364.8 26Q365.6 23.1 365.7 20.1Q365.9 17.2 365.2 15.1Q364.6 13.1 363.4 12.4Q362.3 11.7 359.4 12.1Q356.5 12.6 354.2 14.4Q351.8 16.1 350.4 18.7Q349 21.4 347.4 26.4Q345.8 31.4 341.3 70.8Q336.8 110.3 336.1 120Q335.5 129.7 336 131.9Q336.5 134.1 338.1 136.5Q339.8 139 341.6 140.2Q343.4 141.4 344.9 141.6Q346.3 141.8 348.4 141.2Q350.5 140.5 353.2 139.1Q355.8 137.6 365.4 131L375 124.4","k":[[0.0,0.0],[0.083,0.0848],[0.167,0.1804],[0.25,0.2571],[0.333,0.3574],[0.417,0.4331],[0.5,0.5208],[0.583,0.5943],[0.667,0.6726],[0.75,0.7511],[0.833,0.8549],[0.917,0.9459],[1.0,1.0]],"t":[0.0,0.441]},{"f":"M415.4 33.3Q414.4 26.7 414.6 25.4Q414.8 24.2 415.5 23.1Q416.1 22 417.7 20.6Q419.2 19.1 421.1 18.4Q422.9 17.7 424.1 17.9Q425.3 18.1 426.4 18.7Q427.4 19.2 428.1 20Q428.8 20.7 429 22.1Q429.2 23.6 424.5 39.8Q419.8 56 411.3 83.4Q402.9 110.7 401.8 116.1Q400.7 121.5 400.2 127.1Q399.8 132.6 400.1 134.4Q400.3 136.2 401 138Q401.6 139.8 403.4 141.9Q405.1 144.1 406.6 145.1Q408.1 146.1 409.7 146.7Q411.4 147.4 413.1 147.6Q414.8 147.8 416.5 147.7Q418.2 147.6 420.5 147.1Q422.8 146.6 425.8 145.5Q428.7 144.5 430.7 143.4Q432.8 142.4 434.7 141Q436.6 139.6 438.8 137.5Q441 135.3 442.9 133Q444.9 130.7 448.7 125Q452.5 119.3 456.3 111.9Q460.1 104.5 464.8 93.4Q469.6 82.3 474.6 68.1Q479.6 53.9 483 42.3Q486.5 30.8 488 27.5Q489.5 24.3 487.4 24Q485.3 23.8 485.1 23.5Q484.9 23.2 484.6 23.8Q484.3 24.3 483.3 27.2Q482.3 30 479.7 40.3Q477.1 50.5 475.7 57.3Q474.4 64.1 472.3 82Q470.3 100 468.2 111.9Q466.1 123.8 466 128.5Q465.8 133.3 466 134.9Q466.2 136.5 466.7 138.3Q467.2 140.1 467.8 141Q468.4 141.9 469.4 142.6Q470.4 143.3 471.5 143.4Q472.6 143.6 473.6 143.3Q474.5 143 479.8 138.8Q485 134.6 484.8 134.4Q484.6 134.2 480.4 136.7Q476.2 139.2 474.5 139.4Q472.8 139.6 472.8 134.2Q472.7 128.8 473.1 125.3Q473.5 121.7 475.4 110.6Q477.4 99.4 479.5 81.6Q481.5 63.7 482.7 57.9Q483.9 52.1 486.6 41.2Q489.4 30.3 489.7 28.1Q490.1 25.8 490 24.3Q490 22.7 487.7 22.8Q485.5 23 485 26.6Q484.5 30.2 483.1 35.3Q481.7 40.4 476.3 56.8Q470.9 73.2 466.4 84.3Q462 95.5 456.7 106.2Q451.5 117 447.8 122.6Q444.2 128.2 440.3 132.7Q436.4 137.1 434.7 138.5Q433 139.9 431.1 141Q429.2 142.1 427.2 142.9Q425.1 143.7 423 144.2Q420.9 144.7 418.8 144.6Q416.8 144.5 415.6 144Q414.4 143.5 412.8 142.4Q411.3 141.2 410.1 139.9Q408.9 138.5 408.2 137.1Q407.4 135.7 407.2 134.6Q406.9 133.5 407.1 129.4Q407.2 125.4 407.7 121.8Q408.3 118.2 409.1 114.7Q410 111.2 422.5 70.2Q435.1 29.2 435.5 27.6Q435.9 25.9 436 24Q436.1 22.1 435.8 21Q435.6 19.9 435 18.9Q434.5 17.9 432.8 16.6Q431.2 15.4 428.5 14.9Q425.8 14.4 423.3 15Q420.7 15.7 418.2 17.6Q415.6 19.5 414.3 21.5Q412.9 23.5 412.9 25.9Q412.9 28.4 413.9 30.9L414.8 33.5Z","m":"M415.1 33.4Q413.7 28.2 413.8 26Q413.9 23.9 415.1 22Q416.3 20.2 418.1 18.9Q419.9 17.5 422 16.8Q424.1 16.2 426.2 16.6Q428.4 17 430.1 18.3Q431.8 19.7 432.2 21.7Q432.7 23.8 419.1 69.2Q405.5 114.6 404.4 122.8Q403.3 131 403.5 133.2Q403.7 135.4 404.6 137.5Q405.5 139.5 407.6 141.6Q409.7 143.7 411.7 144.6Q413.7 145.6 416.7 145.8Q419.6 146 422.6 145.4Q425.5 144.7 428.2 143.5Q431 142.3 433.4 140.6Q435.9 138.9 441.3 132.6Q446.8 126.4 451.3 118.6Q455.9 110.9 461.7 97.8Q467.6 84.8 473.3 68.5Q479.1 52.2 483.4 37.7Q487.6 23.3 483 42.4Q478.3 61.6 476.1 80.3Q473.9 99 471.6 113.8Q469.2 128.7 469.5 133.2Q469.7 137.7 470.6 139.5Q471.5 141.3 473.5 141Q475.4 140.8 480.1 137.6L484.8 134.4","k":[[0.0,0.0],[0.083,0.0377],[0.167,0.0832],[0.25,0.1932],[0.333,0.3057],[0.417,0.3737],[0.5,0.4624],[0.583,0.575],[0.667,0.6897],[0.75,0.7791],[0.833,0.8929],[0.917,0.9625],[1.0,1.0]],"t":[0.491,0.157]},{"f":"M493.2 127.6Q517.2 88.5 518.5 86.7Q519.8 84.9 521.2 83.8Q522.6 82.7 522.1 82.8Q521.6 82.9 520.5 91.3Q519.5 99.7 517.8 106.1Q516.2 112.5 512.3 124.6Q508.3 136.6 498.6 162.5Q488.9 188.5 487.1 192.4Q485.4 196.3 483.3 200Q481.2 203.8 480 205.4Q478.8 207 477.8 207.7Q476.9 208.3 475.7 208.3Q474.6 208.4 472.9 207.4Q471.1 206.5 470.2 205Q469.2 203.4 469.3 202.3Q469.5 201.1 488.3 167.9Q507.1 134.6 509.2 129.7Q511.3 124.9 515.2 113.5Q519 102.1 521.7 96Q524.4 89.8 525.9 87.4Q527.4 84.9 528.4 83.9Q529.4 82.9 531.1 81.7Q532.9 80.5 536.2 79.1Q539.6 77.8 542.4 77.7Q545.2 77.6 547.7 78.5Q550.2 79.5 552.8 81.5Q555.4 83.5 556.4 84.8Q557.4 86.2 557.9 87.2Q558.3 88.2 558.7 90.1Q559.1 91.9 559.2 93.9Q559.3 95.9 558.8 99.9Q558.3 104 556.9 107.8Q555.5 111.7 553.4 115.4Q551.3 119.2 548.7 122.6Q546.1 126 542.9 129Q539.7 132 537.3 133.6Q534.9 135.2 532.2 136.1Q529.5 137 526.6 137.1Q523.8 137.1 519.7 136.5Q515.6 135.9 515.5 136.2Q515.4 136.5 519.5 137.6Q523.6 138.7 526.7 138.8Q529.8 139 532.8 138.1Q535.8 137.2 539.9 135Q543.9 132.7 547.6 129.8Q551.3 127 554.4 123.5Q557.6 119.9 560.1 115.9Q562.6 111.9 564 108Q565.4 104.1 565.9 99.3Q566.3 94.4 566.1 91.9Q565.8 89.4 565.4 87.7Q564.9 86 563.6 83.5Q562.3 81.1 561 79.8Q559.6 78.5 558.2 77.6Q556.7 76.7 555.1 76.1Q553.5 75.5 551.1 75Q548.6 74.6 546.9 74.6Q545.3 74.6 542.9 75Q540.6 75.3 538.3 76Q536.1 76.7 534 77.7Q531.9 78.7 530 80.1Q528.1 81.4 527 82.5Q525.9 83.7 524.2 86.3Q522.6 88.9 519.9 95.2Q517.1 101.4 513.3 112.8Q509.5 124.2 507.4 128.9Q505.3 133.7 486.5 167.1Q467.6 200.5 467.4 202.1Q467.2 203.8 467.5 204.6Q467.8 205.4 468.8 206.7Q469.8 208 471.1 208.9Q472.5 209.8 474.1 210.3Q475.6 210.9 476.5 210.9Q477.4 210.9 478.2 210.7Q479.1 210.5 480.6 209.6Q482.1 208.8 485 206Q487.9 203.2 490.5 199.2Q493.1 195.2 494.9 191Q496.8 186.8 505.3 164.2Q513.8 141.7 517.6 130.3Q521.5 118.8 523.4 112.2Q525.3 105.7 526.4 99.5Q527.5 93.3 527.6 91Q527.8 88.6 527.5 86.2Q527.3 83.7 526.5 81.8Q525.6 79.9 524.4 79.3Q523.2 78.7 522.1 79Q520.9 79.4 519.8 80.8Q518.7 82.1 511.2 94.4Q503.6 106.6 500.2 112.5Q496.9 118.3 494.8 122.8L492.7 127.3Z","m":"M492.9 127.5Q506.8 103.2 513.8 92.6Q520.7 81.9 521.8 81.3Q522.8 80.8 523.6 82.4Q524.3 84 524.1 89.2Q523.8 94.5 523.1 98.9Q522.3 103.4 516.7 121.3Q511.1 139.2 500.9 165.8Q490.8 192.5 489 195.8Q487.3 199.1 484.6 202.8Q481.9 206.4 480.2 207.7Q478.5 209.1 476.4 209.3Q474.3 209.4 471.9 207.8Q469.4 206.2 468.8 204.9Q468.2 203.6 468.4 202.2Q468.5 200.8 487.4 167.5Q506.2 134.2 508.3 129.3Q510.4 124.5 514.2 113.1Q518.1 101.8 520.8 95.6Q523.5 89.4 525.1 86.8Q526.6 84.3 530.2 81.6Q533.7 78.9 536.5 77.8Q539.3 76.8 541.5 76.4Q543.7 76.1 547.4 76.7Q551.1 77.3 554.8 79.7Q558.6 82 560.1 84.6Q561.6 87.1 562.2 91.5Q562.8 96 562.2 100.4Q561.6 104.9 559.6 109.7Q557.6 114.5 553.1 120.5Q548.6 126.5 545.8 129Q543 131.4 539.8 133.5Q536.7 135.5 534.6 136.4Q532.5 137.3 530.4 137.7Q528.2 138.1 521.8 137.2L515.5 136.2","k":[[0.0,0.0],[0.083,0.0915],[0.167,0.1324],[0.25,0.2376],[0.333,0.353],[0.417,0.429],[0.5,0.4849],[0.583,0.6004],[0.667,0.7083],[0.75,0.7857],[0.833,0.857],[0.917,0.9472],[1.0,1.0]],"t":[0.683,0.157]}],"flourish":{"f":"M60.9 184.4Q82.6 187.5 96.8 189.1Q111 190.8 121.5 191.6Q132 192.4 141 192.8Q150 193.1 163.6 193.2Q177.1 193.3 192.9 192.9Q208.7 192.5 226.7 191.7Q244.7 190.9 259.7 189.9Q274.7 188.9 291.2 187.4Q307.6 185.8 324.8 183.8Q342 181.9 362.1 179.1Q382.2 176.3 396.3 174Q410.4 171.7 419.2 169.9Q428 168.1 435.3 166.2Q442.6 164.3 452.7 161.1Q462.7 157.9 473 154.2Q483.3 150.4 483.2 150.2Q483.1 150 482.7 150.2Q482.2 150.3 470.1 154.4Q458.1 158.4 448.8 161.3Q439.4 164.1 432.1 165.8Q424.8 167.5 416 169.2Q407.2 171 393.1 173.2Q379 175.5 358.9 178.2Q338.8 180.9 322.4 182.8Q306 184.7 290.3 186.1Q274.6 187.6 260.4 188.5Q246.1 189.5 228.9 190.3Q211.6 191.1 196.6 191.4Q181.6 191.8 168.8 191.8Q156.1 191.8 147.1 191.5Q138.1 191.2 130.6 190.7Q123.1 190.2 92 187L61 183.8Z","m":"M60.3 184Q116.4 190.4 135 191.4Q153.6 192.4 182 192.1Q210.4 191.8 243 190Q275.6 188.2 308.6 184.7Q341.6 181.2 376.1 176.1Q410.5 171 425.9 167.6Q441.2 164.2 462.5 157.1L483.8 150","t":[0.82,0.18]}};

const EASE_IN_OUT = "cubic-bezier(0.76, 0, 0.24, 1)";
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN = "cubic-bezier(0.7, 0, 0.84, 0)";
const HANDOFF_COOKIE = "lu_wipe";
const SVG_NS = "http://www.w3.org/2000/svg";

let root = null;
let panel = null;
let glint = null;
let sign = null; // the <svg> signature
let halo = null;
let status = null; // the status line at the foot of the panel
let statusText = null;
let statusBar = null;
let live = null; // polite live region for assistive tech
let penMasks = []; // the animated mask paths, stroke by stroke
let penStarted = 0; // performance.now() when the pen started
let holdTimers = [];
let state = "idle"; // idle | covering | covered | revealing
let gen = 0; // bumped on every cover()/hideNow(): a stale reveal() bails out

const hasDOM = typeof window !== "undefined" && typeof document !== "undefined";

function reducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function style(el, props) {
  for (const key in props) el.style[key] = props[key];
  return el;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function finished(animation) {
  return animation.finished.catch(() => undefined);
}

function cssVar(name) {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  } catch {
    return "";
  }
}

function panelColor() {
  return config.panel || cssVar("--foreground") || FALLBACK_PANEL;
}

function inkColor() {
  return config.ink || cssVar("--background") || FALLBACK_INK;
}

function accentColor() {
  return config.accent || cssVar("--lu-edge") || VIOLET;
}

/** "fr" when the visitor chose French (lu_locale cookie or storage), else <html lang>. */
function language() {
  try {
    const cookie = document.cookie.match(/(?:^|;\s*)lu_locale=(en|fr)\b/);
    if (cookie) return cookie[1];
  } catch {
    /* ignore */
  }
  try {
    const stored = window.localStorage.getItem("lu_locale");
    if (stored === "en" || stored === "fr") return stored;
  } catch {
    /* ignore */
  }
  const lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  return config.messages[lang] ? lang : "en";
}

function layer(extra) {
  return style(document.createElement("div"), {
    position: "absolute",
    inset: "0",
    transform: "translate3d(0, calc(100% + 8px), 0)",
    willChange: "transform",
    ...extra,
  });
}

function signatureMarkup() {
  const S = SIGNATURE;
  const masks = S.strokes
    .map(
      (s, i) =>
        `<mask id="lu-pen-m${i}" maskUnits="userSpaceOnUse" x="${S.vb[0] - 20}" y="${S.vb[1] - 20}" width="${S.vb[2] + 40}" height="${S.vb[3] + 40}"><path data-pen d="${s.m}" pathLength="1" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 2" stroke-dashoffset="1"/></mask>`,
    )
    .join("");
  const n = S.strokes.length;
  const swash = S.flourish;
  const swashMask = `<mask id="lu-pen-m${n}" maskUnits="userSpaceOnUse" x="${S.vb[0] - 20}" y="${S.vb[1] - 20}" width="${S.vb[2] + 40}" height="${S.vb[3] + 40}"><path data-pen d="${swash.m}" pathLength="1" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 2" stroke-dashoffset="1"/></mask>`;
  const ink = S.strokes
    .map((s, i) => `<g mask="url(#lu-pen-m${i})"><path d="${s.f}"/></g>`)
    .join("");
  return (
    `<svg viewBox="${S.vb.join(" ")}" width="100%" height="100%" xmlns="${SVG_NS}" style="display:block;overflow:visible" fill="currentColor">` +
    `<defs>${masks}${swashMask}</defs>${ink}` +
    `<g mask="url(#lu-pen-m${n})" style="fill:var(--lu-accent, ${VIOLET})"><path d="${swash.f}"/></g></svg>`
  );
}

function build() {
  if (root && root.isConnected) return;
  root = style(document.createElement("div"), {
    position: "fixed",
    inset: "0",
    zIndex: "2147483000",
    pointerEvents: "none",
    overflow: "hidden",
    visibility: "hidden",
    contain: "strict",
  });
  root.setAttribute("data-lu-transition", "");
  root.setAttribute("aria-hidden", "true");

  panel = layer({ background: FALLBACK_PANEL });
  // Accent hairlines riding on the panel: leading edge on the way in,
  // trailing edge on the way out. Off screen while fully covered.
  for (const side of ["top", "bottom"]) {
    const line = style(document.createElement("div"), {
      position: "absolute",
      left: "0",
      right: "0",
      height: `${config.edge}px`,
      background: "var(--lu-accent, " + VIOLET + ")",
    });
    line.setAttribute("data-edge", "");
    line.style[side] = `-${config.edge}px`;
    panel.appendChild(line);
  }

  // The signature, centred. Width clamps so it stays a signature, not a banner.
  glint = style(document.createElement("div"), {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "clamp(230px, 34vw, 420px)",
    aspectRatio: `${SIGNATURE.vb[2]} / ${SIGNATURE.vb[3]}`,
    transform: "translate(-50%, -52%)",
    color: FALLBACK_INK,
    willChange: "transform, opacity",
  });
  halo = style(document.createElement("div"), {
    position: "absolute",
    inset: "-45% -30%",
    borderRadius: "50%",
    opacity: "0",
    background:
      "radial-gradient(closest-side, color-mix(in srgb, var(--lu-accent, " +
      VIOLET +
      ") 30%, transparent) 0%, transparent 100%)",
  });
  const wrap = style(document.createElement("div"), {
    position: "absolute",
    inset: "0",
  });
  wrap.innerHTML = signatureMarkup();
  sign = wrap;
  glint.appendChild(halo);
  glint.appendChild(wrap);
  penMasks = Array.from(wrap.querySelectorAll("[data-pen]"));

  // Status line (only ever shown when the next page is slow).
  status = style(document.createElement("div"), {
    position: "absolute",
    left: "0",
    right: "0",
    bottom: "max(28px, calc(env(safe-area-inset-bottom, 0px) + 22px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "0 24px",
    textAlign: "center",
    opacity: "0",
    visibility: "hidden",
    color: FALLBACK_INK,
    font: "500 13px/1.5 var(--font-jetbrains, ui-monospace, SFMono-Regular, Menlo, monospace)",
    letterSpacing: "0.04em",
  });
  statusText = document.createElement("span");
  const track = style(document.createElement("span"), {
    position: "relative",
    display: "block",
    width: "96px",
    height: "1px",
    overflow: "hidden",
    background: "currentColor",
    opacity: "1",
  });
  // the track is the faint base, the bar the moving accent
  track.style.background = "color-mix(in srgb, currentColor 18%, transparent)";
  statusBar = style(document.createElement("span"), {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "42%",
    background: "var(--lu-accent, " + VIOLET + ")",
    transform: "translate3d(-100%, 0, 0)",
    willChange: "transform",
  });
  track.appendChild(statusBar);
  status.appendChild(statusText);
  status.appendChild(track);

  live = style(document.createElement("div"), {
    position: "fixed",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
  });
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");

  root.appendChild(panel);
  root.appendChild(glint);
  root.appendChild(status);
  document.body.appendChild(root);
  document.body.appendChild(live);
}

function paint() {
  const accent = accentColor();
  root.style.setProperty("--lu-accent", accent);
  panel.style.background = panelColor();
  const ink = inkColor();
  glint.style.color = ink;
  status.style.color = ink;
}

function show() {
  build();
  paint();
  root.style.visibility = "visible";
  root.style.pointerEvents = "auto";
}

function cancelAll() {
  for (const el of [panel, glint, halo, sign, status, statusText, statusBar, ...penMasks]) {
    if (!el) continue;
    for (const a of el.getAnimations()) a.cancel();
  }
}

function clearHold() {
  for (const t of holdTimers) clearTimeout(t);
  holdTimers = [];
  if (status) {
    for (const a of status.getAnimations()) a.cancel();
    for (const a of statusText.getAnimations()) a.cancel();
    for (const a of statusBar.getAnimations()) a.cancel();
    status.style.visibility = "hidden";
    status.style.opacity = "0";
  }
  if (live) live.textContent = "";
}

function hideNow() {
  if (!root) return;
  gen++;
  clearHold();
  cancelAll();
  root.style.visibility = "hidden";
  root.style.pointerEvents = "none";
  state = "idle";
}

function slide(el, from, to, duration, delay) {
  return el.animate(
    [
      { transform: `translate3d(0, ${from}, 0)` },
      { transform: `translate3d(0, ${to}, 0)` },
    ],
    { duration, delay, easing: EASE_IN_OUT, fill: "forwards" },
  );
}

/** Starts the pen. `at` = ms from now; `total` = ms the full signature takes. */
function startPen(at, total) {
  penStarted = performance.now() + at;
  SIGNATURE.strokes.concat([SIGNATURE.flourish]).forEach((s, i) => {
    const mask = penMasks[i];
    if (!mask) return;
    const keyframes = s.k
      ? s.k.map(([t, d]) => ({ offset: t, strokeDashoffset: String(1 - d) }))
      : [
          { offset: 0, strokeDashoffset: "1" },
          { offset: 1, strokeDashoffset: "0" },
        ];
    mask.animate(keyframes, {
      duration: Math.max(1, s.t[1] * total),
      delay: at + s.t[0] * total,
      easing: "linear",
      fill: "both",
    });
  });
  halo.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: total * 0.7,
    delay: at,
    easing: "ease-out",
    fill: "forwards",
  });
  // Ink settle: when the last stroke lands the word relaxes a hair.
  const mine = gen;
  Promise.all(penAnimations().map(finished)).then(() => {
    if (mine !== gen || state === "idle" || penRemaining() > 0) return;
    sign.animate([{ transform: "scale(1.02)" }, { transform: "scale(1)" }], {
      duration: 320,
      easing: EASE_OUT,
      fill: "forwards",
    });
  });
}

/** Jumps the pen to the end (signature complete). */
function finishPenNow() {
  for (const a of penMasks.flatMap((m) => m.getAnimations())) a.finish();
  halo.style.opacity = "1";
}

function penAnimations() {
  return penMasks.flatMap((m) => m.getAnimations());
}

function penRemaining() {
  let remaining = 0;
  for (const a of penAnimations()) {
    const t = a.effect && a.effect.getComputedTiming();
    if (!t) continue;
    const local = a.currentTime == null ? 0 : Number(a.currentTime);
    remaining = Math.max(remaining, (t.endTime - local) / (a.playbackRate || 1));
  }
  return remaining;
}

/** The status line: shows after `waitAfter` of holding, switches after `waitLongAfter`. */
function startHold() {
  clearHold();
  const lines = config.messages[language()] || config.messages.en;
  const showLine = (index) => {
    if (state !== "covered" && state !== "covering") return;
    statusText.textContent = lines[index] || lines[0];
    if (live) live.textContent = statusText.textContent;
    if (index === 0) {
      status.style.visibility = "visible";
      status.animate(
        [
          { opacity: 0, transform: "translate3d(0, 8px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        { duration: 380, easing: EASE_OUT, fill: "forwards" },
      );
      statusBar.animate(
        [
          { transform: "translate3d(-100%, 0, 0)" },
          { transform: "translate3d(240%, 0, 0)" },
        ],
        { duration: 1500, iterations: Infinity, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
      );
    } else {
      statusText.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 320,
        easing: "ease-out",
      });
    }
  };
  holdTimers.push(setTimeout(() => showLine(0), config.waitAfter));
  holdTimers.push(setTimeout(() => showLine(1), config.waitLongAfter));
}

/** Sweeps the panel in until the screen is covered. Resolves when covered. */
export function cover() {
  if (!hasDOM || reducedMotion()) return Promise.resolve();
  show();
  cancelAll();
  clearHold();
  gen++;
  state = "covering";
  const a = slide(panel, "calc(100% + 8px)", "0", config.cover, 0);
  // The pen touches down as the panel reaches the middle of the screen.
  startPen(config.cover * 0.5, config.write);
  announce("cover");
  return finished(a)
    .then(() => wait(config.hold))
    .then(() => {
      if (state === "covering") {
        state = "covered";
        startHold();
      }
    });
}

/** Sweeps the panel away, revealing the page. Resolves when done. */
export async function reveal() {
  if (!hasDOM || !root || state === "idle") return;
  const mine = gen;
  clearHold();
  // The page is ready: let the pen hurry to the end of the word instead of
  // making people wait for a full write.
  const remaining = penRemaining();
  if (remaining > 0) {
    const rate = Math.min(8, Math.max(1, remaining / config.finish));
    for (const a of penAnimations()) a.updatePlaybackRate(rate);
    await wait(Math.min(remaining, config.finish) + 24);
  }
  if (mine !== gen || state === "idle") return;
  state = "revealing";
  announce("reveal");
  // The signed word lifts away just ahead of the panel.
  glint.animate(
    [
      { opacity: 1, transform: "translate(-50%, -52%)" },
      { opacity: 1, offset: 0.3 },
      { opacity: 0, transform: "translate(-50%, -58%)" },
    ],
    { duration: 300, easing: EASE_IN, fill: "forwards" },
  );
  const a = slide(panel, "0", "calc(-100% - 8px)", config.reveal, 60);
  await finished(a);
  if (mine === gen && state === "revealing") hideNow();
}

function announce(phase) {
  try {
    document.dispatchEvent(new CustomEvent("lu-transition", { detail: { phase } }));
  } catch {
    /* ignore */
  }
}

/** Cover, run `during` (navigate, swap content…), then reveal. */
export async function play(during) {
  await cover();
  try {
    if (during) await during();
  } finally {
    await reveal();
  }
}

function cookieDomain() {
  if (config.domain) return config.domain;
  const host = location.hostname;
  return /(^|\.)levelup-ecosystem\.com$/.test(host)
    ? ".levelup-ecosystem.com"
    : null;
}

/** True for links to another LevelUp app (studio., dashboard., the showcase). */
export function isEcosystemUrl(url) {
  try {
    const u = typeof url === "string" ? new URL(url, location.href) : url;
    return /(^|\.)levelup-ecosystem\.com$/.test(u.hostname);
  } catch {
    return false;
  }
}

function setHandoff(url) {
  const domain = cookieDomain();
  if (!domain) return;
  try {
    const u = new URL(url, location.href);
    if (u.host === location.host || !isEcosystemUrl(u)) return;
    document.cookie = `${HANDOFF_COOKIE}=1; Domain=${domain}; Path=/; Max-Age=10; SameSite=Lax; Secure`;
  } catch {
    /* ignore */
  }
}

/**
 * Full-page navigation with the wipe: cover, then load `url`. Another LevelUp
 * app can finish the wipe with revealOnLoad(), so it feels like one product.
 */
export function go(url, options = {}) {
  if (!hasDOM) return Promise.resolve();
  setHandoff(url);
  return cover().then(() => {
    if (options.replace) location.replace(url);
    else location.assign(url);
  });
}

/**
 * Call once, as early as possible, on page load: when the visitor arrives from
 * another LevelUp app through go(), start covered and sweep the panel away.
 * Pair it with levelup-transition.css to avoid any flash before this runs.
 */
export function revealOnLoad() {
  if (!hasDOM) return Promise.resolve(false);
  const html = document.documentElement;
  const flagged =
    new RegExp(`(?:^|;\\s*)${HANDOFF_COOKIE}=1`).test(document.cookie) &&
    html.classList.contains("lu-wipe-in");
  const domain = cookieDomain();
  document.cookie = `${HANDOFF_COOKIE}=; Path=/; Max-Age=0${domain ? `; Domain=${domain}` : ""}`;
  if (!flagged) {
    html.classList.remove("lu-wipe-in");
    return Promise.resolve(false);
  }
  if (reducedMotion()) {
    html.classList.remove("lu-wipe-in");
    return Promise.resolve(false);
  }
  show();
  cancelAll();
  panel.animate([{ transform: "translate3d(0, 0, 0)" }], {
    duration: 0,
    fill: "forwards",
  });
  // The word was written in the other app: arrive with it already signed.
  startPen(0, 1);
  finishPenNow();
  state = "covered";
  html.classList.remove("lu-wipe-in");
  return wait(90)
    .then(reveal)
    .then(() => true);
}

/**
 * Click delegation for plain <a href> links.
 * - same-origin links: `onInternal(href)` (an SPA router), or a full load with the wipe;
 * - links to other LevelUp apps: go(href).
 * Modified clicks, target="_blank", downloads, `data-no-transition` links and
 * reduced-motion visitors are left to the browser / router.
 * Returns a function that removes the listener.
 */
export function intercept(options = {}) {
  if (!hasDOM) return () => {};
  const { onInternal, isExternal = isEcosystemUrl } = options;
  const handler = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      reducedMotion()
    ) {
      return;
    }
    const anchor =
      event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (
      !anchor ||
      anchor.hasAttribute("download") ||
      anchor.closest("[data-no-transition]")
    ) {
      return;
    }
    const target = anchor.getAttribute("target");
    if (target && target !== "_self") return;
    let url;
    try {
      url = new URL(anchor.href, location.href);
    } catch {
      return;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    if (url.origin === location.origin) {
      // Same page (only the hash differs): native scrolling.
      if (url.pathname === location.pathname && url.search === location.search)
        return;
      event.preventDefault();
      const href = url.pathname + url.search + url.hash;
      if (onInternal) onInternal(href, anchor);
      else go(href);
    } else if (isExternal(url)) {
      event.preventDefault();
      go(url.href);
    }
  };
  document.addEventListener("click", handler, true);
  return () => document.removeEventListener("click", handler, true);
}

/** Override durations, colours, messages or the handoff cookie domain. */
export function configure(options = {}) {
  Object.assign(config, options);
}

if (hasDOM) {
  // Back/forward cache: a page left mid-wipe must come back uncovered.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) hideNow();
  });
  window.LevelUpTransition = {
    cover,
    reveal,
    play,
    go,
    intercept,
    revealOnLoad,
    configure,
    isEcosystemUrl,
  };
}
