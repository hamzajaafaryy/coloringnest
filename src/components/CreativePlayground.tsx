/** Decorative, code-native artwork for the coloring-table hero. */
export default function CreativePlayground() {
  return (
    <div className="cc-playground" aria-hidden="true">
      <span className="cc-sticker cc-sticker-top">
        A little color. A lot of happy!
      </span>
      <div className="cc-drawing-paper">
        <span className="cc-paper-tape" />
        <svg
          viewBox="0 0 440 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            stroke="#20334c"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M72 247a149 149 0 0 1 298 0h-33a116 116 0 0 0-232 0Z"
              fill="#ff8876"
            />
            <path
              d="M105 247a116 116 0 0 1 232 0h-33a83 83 0 0 0-166 0Z"
              fill="#ffd459"
            />
            <path
              d="M138 247a83 83 0 0 1 166 0h-33a50 50 0 0 0-100 0Z"
              fill="#70c7e4"
            />
            <path
              d="M62 263c-39 0-42-47-9-56-3-40 55-46 63-12 30-10 57 24 36 49-4 12-17 19-32 19Z"
              fill="white"
            />
            <path
              d="M319 267c-39 0-42-47-9-56-3-40 55-46 63-12 30-10 57 24 36 49-4 12-17 19-32 19Z"
              fill="white"
            />
            <circle cx="355" cy="67" r="29" fill="#ffd459" />
            <path d="M355 22V12m0 110v-10m45-45h10m-110 0h10m77-32 8-8m-80 80 8-8m64 0 8 8m-80-80 8 8" />
            <path
              d="m82 51 8 20 22 2-17 14 5 21-18-11-19 11 5-21-17-14 22-2Z"
              fill="#ffd459"
            />
            <path
              d="m218 299 9 14 16-5-10 15 9 14-17-4-9 14-1-17-16-6 16-5Z"
              fill="#ff8876"
            />
            <path
              d="M77 232h1m28 0h1m-23 11q9 9 17-1M338 236h1m27 0h1m-22 12q8 8 16-1"
              strokeWidth="5"
            />
            <path d="M40 316q33-14 61 0m247-10q22 15 45 0" stroke="#4f9f83" />
            <path d="m145 45 8-9m72 25 6-10m-64 242-8 6" stroke="#3984da" />
          </g>
        </svg>
        <span className="cc-paper-caption">Your imagination goes here.</span>
      </div>
      <div className="cc-crayons">
        {["#367edb", "#ff8876", "#ffd459"].map((color, i) => (
          <span
            key={color}
            className="cc-crayon"
            style={{
              backgroundColor: color,
              transform: `rotate(${i * 7 - 9}deg)`,
            }}
          >
            <span />
          </span>
        ))}
      </div>
      <span className="cc-sticker cc-sticker-bottom">100% free to create</span>
    </div>
  );
}
