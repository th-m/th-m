import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { thomDesignTokens } from "@th-m/design-theme";
import { useEffect, useRef } from "react";

const design = thomDesignTokens;

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  ariaLabel?: string;
}

const thomEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: design.color.background,
    color: design.color.foreground,
    fontFamily: design.typography.mono,
    fontSize: "11px",
  },
  ".cm-content": { padding: "14px 0", caretColor: design.color.primary.default },
  ".cm-line": { padding: "0 14px", lineHeight: "1.75" },
  ".cm-gutters": {
    backgroundColor: design.color.surface,
    color: design.color.foregroundSubtle,
    borderRight: `1px solid ${design.color.border}`,
  },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: `color-mix(in srgb, ${design.color.primary.default} 10%, transparent)` },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: `color-mix(in srgb, ${design.color.primary.default} 22%, transparent) !important`,
  },
  "&.cm-focused": { outline: `2px solid ${design.color.ring}`, outlineOffset: "-2px" },
});

const thomHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: design.color.primary.default },
  { tag: [tags.typeName, tags.className], color: design.color.foregroundStrong },
  { tag: [tags.string, tags.number, tags.bool, tags.null], color: design.color.foreground },
  { tag: [tags.variableName, tags.propertyName], color: design.color.foreground },
  { tag: tags.comment, color: design.color.foregroundMuted, fontStyle: "italic" },
]);

export function CodeEditor({ value, onChange, readOnly = false, ariaLabel = "TypeScript source" }: CodeEditorProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!mountRef.current) return;
    const view = new EditorView({
      parent: mountRef.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightSpecialChars(),
          drawSelection(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          history(),
          keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
          javascript({ typescript: true }),
          syntaxHighlighting(thomHighlightStyle),
          EditorState.readOnly.of(readOnly),
          EditorView.editable.of(!readOnly),
          EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
          thomEditorTheme,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current?.(update.state.doc.toString());
          }),
        ],
      }),
    });
    view.scrollDOM.tabIndex = 0;
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [ariaLabel, readOnly]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || view.state.doc.toString() === value) return;
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
  }, [value]);

  return <div className="set-code-editor" ref={mountRef} />;
}
