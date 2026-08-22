import { useMemo, useState } from "react";
import {
  defaultEmbeddingDataset,
  nearestNeighbors,
  searchEmbeddingDataset,
} from "@th-m/embedding-space";

/**
 * Compact auxiliary interactive for the tool drawer: search the curated GPT-2
 * token space, then inspect the nearest neighbors of a selected entry. Deliberately
 * lighter than the full `/embedding-space` atlas route.
 */
export function EmbeddingExplorer() {
  const dataset = defaultEmbeddingDataset;
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const result = useMemo(() => searchEmbeddingDataset(dataset, query), [dataset, query]);
  const selected = result.matches.find((point) => point.id === selectedId) ?? null;
  const neighbors = useMemo(
    () => (selected ? nearestNeighbors(selected.vector, dataset.points, 6, [selected.id]) : []),
    [dataset, selected],
  );

  return (
    <div className="embedding-explorer">
      <label className="embedding-explorer__search">
        <span aria-hidden="true">Search</span>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedId(null);
          }}
          placeholder="king, Ġwater, analog…"
          aria-label="Search embedding entries"
        />
      </label>

      <p className="embedding-explorer__status" role="status">
        {result.status === "unsupported"
          ? result.message
          : result.status === "matches"
            ? result.message
            : `${dataset.points.length} curated GPT-2 token entries.`}
      </p>

      {selected ? (
        <div className="embedding-explorer__detail">
          <h4>{selected.label}</h4>
          <p>{selected.description}</p>
          <ol className="embedding-explorer__neighbors" aria-label={`Nearest neighbors to ${selected.label}`}>
            {neighbors.map(({ point, similarity }) => (
              <li key={point.id}>
                <span>{point.label}</span>
                <span>{similarity.toFixed(3)}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {result.matches.length > 0 && !selected ? (
        <ul className="embedding-explorer__list" aria-label="Embedding search matches">
          {result.matches.map((point) => (
            <li key={point.id}>
              <button
                type="button"
                className={point.id === selectedId ? "is-active" : ""}
                onClick={() => setSelectedId(point.id)}
              >
                <span>{point.label}</span>
                <small>{point.cluster}</small>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {result.matches.length === 0 && result.status !== "idle" ? (
        <p className="embedding-explorer__empty">{result.message}</p>
      ) : null}
    </div>
  );
}
