import { accentPalette, type AccentColorName } from "@th-m/design-theme";
import o200kRanks from "gpt-tokenizer/bpeRanks/o200k_base";
import { encode } from "gpt-tokenizer/encoding/o200k_base";

export const TOKENIZER_ENCODING = "o200k_base" as const;

export type TokenDisplayKind =
  | "text"
  | "space"
  | "line-break"
  | "tab"
  | "carriage-return"
  | "non-breaking-space"
  | "whitespace"
  | "bytes";

export interface TokenDisplayPart {
  kind: TokenDisplayKind;
  value: string;
  label: string;
}

export interface TokenAccent {
  index: number;
  name: AccentColorName;
  value: string;
}

export interface TokenPiece {
  index: number;
  id: number;
  bytes: readonly number[];
  byteLabel: string;
  text: string | null;
  display: readonly TokenDisplayPart[];
  whitespaceOnly: boolean;
  accent: TokenAccent;
}

const textEncoder = new TextEncoder();

// These transitions avoid the closest hue neighbors in the THOM categorical
// palette while still varying the sequence from the token IDs.
const distinctNeighborChoices: readonly (readonly number[])[] = [
  [2, 1, 4],
  [2, 4, 0],
  [0, 1, 3, 5, 4],
  [2, 4, 1],
  [1, 3, 5, 0, 2],
  [2, 4, 0],
];

function stableTokenHash(tokenId: number): number {
  let value = Math.imul(tokenId ^ 0x9e3779b9, 0x85ebca6b);
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35);
  return (value ^ (value >>> 16)) >>> 0;
}

function accentAt(index: number): TokenAccent {
  const accent = accentPalette[index];
  if (!accent) throw new Error(`THOM accent ${index} does not exist.`);
  return { index, name: accent.name, value: accent.value };
}

export function assignTokenAccents(tokenIds: readonly number[]): TokenAccent[] {
  let previousIndex: number | undefined;

  return tokenIds.map((tokenId) => {
    const hash = stableTokenHash(tokenId);
    const index = previousIndex === undefined
      ? hash % accentPalette.length
      : distinctNeighborChoices[previousIndex]![hash % distinctNeighborChoices[previousIndex]!.length]!;
    previousIndex = index;
    return accentAt(index);
  });
}

function stableTextHash(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function assignTextTokenAccents(tokens: readonly string[]): TokenAccent[] {
  return assignTokenAccents(tokens.map(stableTextHash));
}

export function formatTokenBytes(bytes: readonly number[]): string {
  return bytes.map((byte) => byte.toString(16).toUpperCase().padStart(2, "0")).join(" ");
}

function tokenBytes(tokenId: number): number[] {
  const rank = o200kRanks[tokenId];
  if (rank === undefined) throw new Error(`Token ${tokenId} is not present in ${TOKENIZER_ENCODING}.`);
  return typeof rank === "string" ? [...textEncoder.encode(rank)] : [...rank];
}

function decodeCompleteUtf8(bytes: readonly number[]): string | null {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bytes));
  } catch {
    return null;
  }
}

function codePointLabel(value: string): string {
  const codePoint = value.codePointAt(0);
  return codePoint === undefined ? "whitespace" : `whitespace U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
}

function whitespacePart(value: string): TokenDisplayPart | null {
  switch (value) {
    case " ": return { kind: "space", value: "·", label: "space" };
    case "\n": return { kind: "line-break", value: "↵", label: "line break" };
    case "\t": return { kind: "tab", value: "⇥", label: "tab" };
    case "\r": return { kind: "carriage-return", value: "␍", label: "carriage return" };
    case "\u00a0": return { kind: "non-breaking-space", value: "⍽", label: "non-breaking space" };
    default:
      return /^\p{White_Space}$/u.test(value)
        ? { kind: "whitespace", value: "◌", label: codePointLabel(value) }
        : null;
  }
}

export function describeTokenText(text: string | null, bytes: readonly number[]): TokenDisplayPart[] {
  if (text === null) {
    const byteLabel = formatTokenBytes(bytes);
    return [{ kind: "bytes", value: byteLabel, label: `UTF-8 byte fragment ${byteLabel}` }];
  }

  const parts: TokenDisplayPart[] = [];
  let plainText = "";

  const flushText = () => {
    if (!plainText) return;
    parts.push({ kind: "text", value: plainText, label: plainText });
    plainText = "";
  };

  for (const value of text) {
    const whitespace = whitespacePart(value);
    if (whitespace) {
      flushText();
      parts.push(whitespace);
    } else {
      plainText += value;
    }
  }
  flushText();
  return parts;
}

export function tokenizeText(input: string): TokenPiece[] {
  if (input.length === 0) return [];

  const tokenIds = encode(input, { disallowedSpecial: new Set() });
  const accents = assignTokenAccents(tokenIds);

  return tokenIds.map((id, index) => {
    const bytes = tokenBytes(id);
    const text = decodeCompleteUtf8(bytes);
    return {
      index,
      id,
      bytes,
      byteLabel: formatTokenBytes(bytes),
      text,
      display: describeTokenText(text, bytes),
      whitespaceOnly: text !== null && /^\p{White_Space}+$/u.test(text),
      accent: accents[index]!,
    };
  });
}

export function reconstructTokenBytes(tokens: readonly TokenPiece[]): Uint8Array {
  return Uint8Array.from(tokens.flatMap((token) => token.bytes));
}
