const monoFont = "IBM Plex Mono, ui-monospace, monospace";
const displayFont = "Newsreader, Georgia, serif";

export function AcquaintanceMapInstrument() {
  return (
    <svg
      className="truth-instrument__svg"
      data-instrument="acquaintance-map"
      viewBox="0 0 520 386"
      fill="none"
      role="img"
      aria-label="Relational acquaintance map"
    >
      <title id="acquaintance-map-title">Relational acquaintance map</title>
      <desc id="acquaintance-map-description">
        A person connected to place, experience, and consequence.
      </desc>

      <g
        data-instrument-part="connections"
        stroke="#a48c65"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g opacity=".54" strokeDasharray="2 5">
          <path d="M213 66 95 161" />
          <path d="m289 65 124 96" />
          <path d="m109 224 142 124" />
          <path d="m393 224-142 124" />
          <path d="M251 84v64" />
          <path d="M251 250v98" />
        </g>

        <path d="M121 198h78M303 198h84" opacity=".78" />

        <g data-instrument-node="place">
          <circle cx="251" cy="47" r="37" opacity=".5" />
          <path d="m226 57 15-20 10 10 10-11 18 21h-53Z" opacity=".8" />
        </g>

        <g data-instrument-node="experience">
          <circle cx="84" cy="198" r="37" opacity=".52" />
          <path d="M61 198c11-16 35-16 46 0-11 16-35 16-46 0Z" opacity=".82" />
          <circle cx="84" cy="198" r="10.5" opacity=".82" />
          <circle cx="84" cy="198" r="4" opacity=".72" />
          <circle cx="84" cy="198" r="2.4" fill="#aa9067" stroke="none" />
        </g>

        <g data-instrument-node="person">
          <circle cx="251" cy="198" r="52" strokeWidth="1.5" opacity=".78" />
          <circle cx="251" cy="184" r="13" opacity=".82" />
          <path d="M230 221c0-16 8-24 21-24s21 8 21 24" opacity=".82" />
        </g>

        <g data-instrument-node="consequence">
          <circle cx="424" cy="198" r="37" opacity=".5" />
          <ellipse cx="424" cy="198" rx="22" ry="12" opacity=".8" />
          <ellipse cx="424" cy="198" rx="16" ry="8" opacity=".8" />
          <ellipse cx="424" cy="198" rx="9" ry="4.5" opacity=".8" />
        </g>

        <g data-instrument-part="markers" fill="#b4966b" stroke="none">
          <circle cx="289" cy="64" r="3.2" />
          <circle cx="95" cy="161" r="3.2" />
          <circle cx="413" cy="161" r="3.2" />
          <circle cx="251" cy="328" r="2.4" />
          <path d="m248 143 3 5 3-5-3 2.2-3-2.2Z" />
          <path d="m248 323 3 5 3-5-3 2.2-3-2.2Z" />
        </g>

        <g data-instrument-part="origin" opacity=".82">
          <path d="M251 337v23" />
          <path d="M240 348h22" />
          <path d="m243 340 16 16" />
          <path d="m259 340-16 16" />
        </g>

        <path data-instrument-part="lower-rule" d="M0 377h481" opacity=".25" />
      </g>

      <g
        data-instrument-part="labels"
        fill="#b4976c"
        fontFamily={monoFont}
        fontSize="13"
        fontWeight="600"
        letterSpacing="1.15"
        textAnchor="middle"
      >
        <text x="251" y="105">PLACE</text>
        <text x="84" y="257">EXPERIENCE</text>
        <text x="251" y="271">PERSON</text>
        <text x="424" y="257">CONSEQUENCE</text>
      </g>
    </svg>
  );
}

export function SincerityAlignmentInstrument() {
  return (
    <svg
      className="truth-instrument__svg"
      data-instrument="sincerity-alignment"
      viewBox="0 0 454 294"
      fill="none"
      role="img"
      aria-label="Sincerity alignment instrument"
    >
      <title id="sincerity-alignment-title">Sincerity alignment instrument</title>
      <desc id="sincerity-alignment-description">
        A central equality mark aligns inner state with outward expression.
      </desc>

      <g
        data-instrument-part="alignment"
        stroke="#938874"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 143h174M246 143h189" opacity=".22" />
        <path
          data-instrument-part="waveform"
          d="M5 143c18 23 39 23 56 0s35-25 59 0 40 25 58 0M246 143c18 23 36 23 54 0s34-25 59 0 40 23 58 0h18"
          opacity=".68"
        />
        <path data-instrument-part="axis" d="M210 73v35M210 180v43" opacity=".72" />

        <circle data-instrument-node="inner-state" cx="210" cy="73" r="6" fill="#a48259" stroke="none" />
        <circle data-instrument-node="outward-expression" cx="210" cy="223" r="6" fill="#a48259" stroke="none" />

        <g data-instrument-node="equality">
          <circle cx="210" cy="144" r="36" strokeWidth="1.5" />
          <path d="M199 138h22M199 150h22" strokeWidth="2" />
        </g>
      </g>

      <g
        data-instrument-part="labels"
        fill="#b4976c"
        fontFamily={monoFont}
        fontSize="12"
        fontWeight="600"
        letterSpacing="1.5"
        textAnchor="middle"
      >
        <text x="210" y="28">INNER STATE</text>
        <text x="210" y="253">OUTWARD EXPRESSION</text>
      </g>
      <g
        data-instrument-part="descriptions"
        fill="#958b79"
        fontFamily={displayFont}
        fontSize="15"
        fontStyle="italic"
        textAnchor="middle"
      >
        <text x="210" y="54">what is felt, believed, intended</text>
        <text x="210" y="281">what is said, shown, enacted</text>
      </g>
    </svg>
  );
}

export function TrustworthinessBalanceInstrument() {
  return (
    <svg
      className="truth-instrument__svg"
      data-instrument="trustworthiness-balance"
      viewBox="0 0 432 318"
      fill="none"
      role="img"
      aria-label="Trustworthiness balance"
    >
      <title id="trustworthiness-balance-title">Trustworthiness balance</title>
      <desc id="trustworthiness-balance-description">
        Evidence and reliance held in balance above the risk or cost of being wrong.
      </desc>

      <g
        data-instrument-part="balance"
        stroke="#a18a65"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M115 44h93M236 44h93" opacity=".72" />
        <path d="M216 29c0-4 2-6 6-8M222 21c-4-3-4-7 0-9 4 2 4 6 0 9v8" opacity=".63" />

        <g data-instrument-node="pivot">
          <circle cx="222" cy="44" r="14" opacity=".76" />
          <circle cx="222" cy="44" r="3.2" opacity=".9" />
        </g>

        <circle cx="115" cy="44" r="5" opacity=".9" />
        <circle cx="329" cy="44" r="5" opacity=".9" />
        <path d="m112 49-51 96M118 49l51 96M326 49l-51 96M332 49l51 96" opacity=".78" />

        <g data-instrument-node="evidence">
          <path d="M61 145h108M61 145c12 18 96 18 108 0" opacity=".84" />
          <path d="m115 95-17 7v20c0 7 5 12 17 17 12-5 17-10 17-17v-20l-17-7Z" opacity=".9" />
          <path d="m107 118 7 7 12-14" opacity=".94" />
        </g>

        <g data-instrument-node="reliance">
          <path d="M275 145h108M275 145c12 18 96 18 108 0" opacity=".84" />
          <circle cx="329" cy="105" r="10.5" opacity=".9" />
          <path d="M310 137c0-16 7-24 19-24s19 8 19 24" opacity=".9" />
        </g>

        <g data-instrument-node="risk">
          <path d="M219.5 58v139M224.5 58v139" opacity=".62" />
          <path
            d="M213 197h18v7h-18zM213 204h18c5 0 8 6 10 13h-38c2-7 5-13 10-13ZM203 217h38c7 0 11 5 13 10h-64c2-5 6-10 13-10ZM190 227h64c7 0 11 3 12 7h-88c1-4 5-7 12-7Z"
            opacity=".72"
          />
        </g>

        <path data-instrument-part="lower-rule" d="M0 313h431" opacity=".22" />
      </g>

      <g
        data-instrument-part="labels"
        fill="#b4976c"
        fontFamily={monoFont}
        fontSize="13"
        fontWeight="600"
        letterSpacing="1.35"
        textAnchor="middle"
      >
        <text x="115" y="181">EVIDENCE</text>
        <text x="329" y="181">RELIANCE</text>
        <text x="222" y="260">RISK</text>
      </g>
      <text
        data-instrument-part="risk-description"
        x="222"
        y="285"
        fill="#958b79"
        fontFamily={displayFont}
        fontSize="16"
        fontStyle="italic"
        textAnchor="middle"
      >
        cost of being wrong
      </text>
    </svg>
  );
}
