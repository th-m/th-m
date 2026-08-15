import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers } from "@codemirror/view";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  ariaLabel?: string;
}

const thomEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "#050505",
    color: "#f2e5cf",
    fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
    fontSize: "11px",
  },
  ".cm-content": { padding: "14px 0", caretColor: "#d6b06a" },
  ".cm-line": { padding: "0 14px", lineHeight: "1.75" },
  ".cm-gutters": {
    backgroundColor: "#080706",
    color: "#6f6557",
    borderRight: "1px solid #342d23",
  },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "rgba(214,176,106,.055)" },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(214,176,106,.22) !important",
  },
  "&.cm-focused": { outline: "1px solid #d6b06a", outlineOffset: "-1px" },
  ".tok-keyword": { color: "#d6b06a" },
  ".tok-typeName, .tok-className": { color: "#fff5dc" },
  ".tok-string, .tok-number, .tok-bool": { color: "#c4aa7d" },
  ".tok-comment": { color: "#756b5d", fontStyle: "italic" },
});

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
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
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
