import type { EmbeddingDataset, EmbeddingPoint } from "./types";

export interface SearchResult {
  matches: EmbeddingPoint[];
  status: "idle" | "matches" | "unsupported";
  message: string;
}

export function searchEmbeddingDataset(dataset: EmbeddingDataset, query: string): SearchResult {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return { matches: dataset.points, status: "idle", message: "" };
  const matches = dataset.points
    .filter((point) =>
      point.label.toLocaleLowerCase().includes(normalized)
      || point.tokenPieces.some((piece) => piece.replace(/^Ġ/, "").toLocaleLowerCase().includes(normalized)),
    )
    .sort((a, b) => {
      const aExact = a.label.toLocaleLowerCase() === normalized ? 0 : 1;
      const bExact = b.label.toLocaleLowerCase() === normalized ? 0 : 1;
      return aExact - bExact || a.label.localeCompare(b.label);
    });
  if (matches.length === 0) {
    return {
      matches: [],
      status: "unsupported",
      message: `“${query.trim()}” is outside this curated offline dataset. Token boundaries vary by tokenizer and surrounding text.`,
    };
  }
  return {
    matches,
    status: "matches",
    message: `${matches.length} curated ${matches.length === 1 ? "entry" : "entries"}.`,
  };
}

