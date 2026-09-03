import "./language-compression-figure.css";

export function LanguageCompressionFigure() {
  return (
    <figure
      className="article-figure language-compression"
      aria-label="From Jon's experience to the word pain: language leaves details unstated"
    >
      <div className="language-compression__graph">
        <div className="language-compression__experience">
          <svg className="language-compression__experience-links" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <line x1="40" y1="40" x2="33" y2="33" />
            <line x1="60" y1="40" x2="67" y2="33" />
            <line x1="40" y1="60" x2="33" y2="67" />
            <line x1="60" y1="60" x2="67" y2="67" />
          </svg>
          <strong>Pain</strong>
          <div className="language-compression__icons">
            <svg viewBox="0 0 24 24" role="img" aria-label="Eye" focusable="false">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg viewBox="0 0 24 24" role="img" aria-label="Heart" focusable="false">
              <path d="M12 21 3.8 13A5.8 5.8 0 0 1 12 4.8 5.8 5.8 0 0 1 20.2 13Z" />
            </svg>
            <svg viewBox="0 0 24 24" role="img" aria-label="Mind" focusable="false">
              <path d="M12 5a3 3 0 0 0-5.8-1A4 4 0 0 0 3 10a4 4 0 0 0 .5 7.3A4 4 0 0 0 12 20V5Z" />
              <path d="M12 5a3 3 0 0 1 5.8-1A4 4 0 0 1 21 10a4 4 0 0 1-.5 7.3A4 4 0 0 1 12 20" />
              <path d="M6.2 4c-.4 2 0 3 1.8 4M3 10c2-1 4 0 4 2m-3.5 5.3C4 15 6 15 7 16m10.8-12c.4 2 0 3-1.8 4m5 2c-2-1-4 0-4 2m3.5 5.3C20 15 18 15 17 16" />
            </svg>
            <svg viewBox="0 0 24 24" role="img" aria-label="Hand" focusable="false">
              <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11V3.5a1.5 1.5 0 0 1 3 0V11V5a1.5 1.5 0 0 1 3 0v7V8a1.5 1.5 0 0 1 3 0v7a7 7 0 0 1-7 7h-1c-2.2 0-4-1-5.3-2.8l-4-5.7a1.6 1.6 0 0 1 2.5-2L8 15" />
            </svg>
          </div>
        </div>
        <div className="language-compression__edge">
          <strong>Represented in language</strong>
          <span className="language-compression__arrow" aria-hidden="true" />
        </div>
        <div className="language-compression__word">
          <strong>“pain”</strong>
        </div>
        <div className="language-compression__omissions">
          <strong className="language-compression__label">Left unstated by this word</strong>
          <span>Cause · intensity · personal history · desired response</span>
        </div>
      </div>
      <figcaption>
        The word names the experience; it does not contain it.
      </figcaption>
    </figure>
  );
}
