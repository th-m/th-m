import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { memo, useEffect, useRef, useState } from "react";

export interface GraphNodeData extends Record<string, unknown> {
  entityId: string;
  statement: string;
  emphasis?: boolean;
  code: string;
  isEditing: boolean;
  onBeginEdit: (layoutId: string) => void;
  onCommit: (layoutId: string, value: string) => void;
  onCancel: () => void;
  onCompositionChange: (composing: boolean) => void;
}

export type PropositionFlowNode = Node<GraphNodeData, "proposition">;
export type RelationshipFlowNode = Node<GraphNodeData, "relationship">;
export type GraphFlowNode = PropositionFlowNode | RelationshipFlowNode;

interface InlineEditorProps {
  value: string;
  className: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
  onCompositionChange: (composing: boolean) => void;
}

function InlineEditor({
  value,
  className,
  onCommit,
  onCancel,
  onCompositionChange,
}: InlineEditorProps) {
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, []);

  const commit = () => {
    if (!cancelled.current) onCommit(draft.trim() || value);
  };

  return (
    <textarea
      ref={textareaRef}
      className={`graph-inline-editor nodrag nowheel ${className}`}
      value={draft}
      rows={4}
      aria-label="Edit statement"
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onCompositionStart={() => onCompositionChange(true)}
      onCompositionEnd={() => onCompositionChange(false)}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Escape") {
          cancelled.current = true;
          onCompositionChange(false);
          onCancel();
        }
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          commit();
        }
      }}
    />
  );
}

export const PropositionNode = memo(function PropositionNode({
  id,
  data,
  selected,
}: NodeProps<PropositionFlowNode>) {
  return (
    <div
      className={`graph-proposition${data.emphasis ? " is-emphasis" : ""}${selected ? " is-selected" : ""}`}
      role="group"
      aria-label={`Proposition: ${data.statement}`}
      tabIndex={0}
      onDoubleClick={() => data.onBeginEdit(id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !data.isEditing) {
          event.preventDefault();
          data.onBeginEdit(id);
        }
      }}
    >
      <Handle id="target-left" type="target" position={Position.Left} />
      <Handle id="target-top" type="target" position={Position.Top} />
      <Handle id="source-right" type="source" position={Position.Right} />
      <Handle id="source-bottom" type="source" position={Position.Bottom} />
      <span className="graph-node-dot" aria-hidden="true" />
      <span className="graph-node-code">{data.code} / PROPOSITION</span>
      {data.isEditing ? (
        <InlineEditor
          value={data.statement}
          className="graph-inline-editor--proposition"
          onCommit={(value) => data.onCommit(id, value)}
          onCancel={data.onCancel}
          onCompositionChange={data.onCompositionChange}
        />
      ) : (
        <span className="graph-proposition-statement">{data.statement}</span>
      )}
      <span className="graph-node-caption">WHAT CAN BE STATED</span>
    </div>
  );
});

export const RelationshipNode = memo(function RelationshipNode({
  id,
  data,
  selected,
}: NodeProps<RelationshipFlowNode>) {
  return (
    <div
      className={`graph-relationship${selected ? " is-selected" : ""}`}
      role="group"
      aria-label={`Relationship: ${data.statement}`}
      tabIndex={0}
      onDoubleClick={() => data.onBeginEdit(id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !data.isEditing) {
          event.preventDefault();
          data.onBeginEdit(id);
        }
      }}
    >
      <Handle
        id="relation-target"
        type="target"
        position={Position.Left}
      />
      <span className="graph-relationship-dot" aria-hidden="true" />
      <span className="graph-relationship-code">{data.code}</span>
      {data.isEditing ? (
        <InlineEditor
          value={data.statement}
          className="graph-inline-editor--relationship"
          onCommit={(value) => data.onCommit(id, value)}
          onCancel={data.onCancel}
          onCompositionChange={data.onCompositionChange}
        />
      ) : (
        <span className="graph-relationship-statement">{data.statement}</span>
      )}
    </div>
  );
});
