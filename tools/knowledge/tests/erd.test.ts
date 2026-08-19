import { describe, expect, it } from "vitest";
import { createMermaidErd, erdToKnowledgeDocument, parsePostgresSchema } from "../src/erd.ts";

const sql = `
create table public.parent (
  left_id uuid not null,
  right_id uuid not null,
  nickname text unique,
  primary key (left_id, right_id)
);
create table public.child (
  id uuid primary key,
  parent_left uuid,
  parent_right uuid,
  constraint child_parent foreign key (parent_left, parent_right) references public.parent(left_id, right_id)
);
create table public.cycle_a (id uuid primary key, b_id uuid);
create table public.cycle_b (id uuid primary key, a_id uuid references public.cycle_a(id));
alter table public.cycle_a add constraint cycle_a_b foreign key (b_id) references public.cycle_b(id);
create table public.island (id bigint primary key);
create schema audit;
create table audit.event (id bigint primary key, parent_left uuid);
`;

describe("PostgreSQL ERD adapter", () => {
  it("normalizes keys, nullability, composite foreign keys, cycles, and disconnected tables", () => {
    const model = parsePostgresSchema(sql);
    expect(model.schemas).toEqual(["public"]);
    expect(model.tables).toHaveLength(5);
    expect(model.foreignKeys).toHaveLength(3);
    const parent = model.tables.find(({ name }) => name === "parent")!;
    expect(parent.columns.filter(({ primary }) => primary).map(({ name }) => name)).toEqual(["left_id", "right_id"]);
    expect(parent.columns.find(({ name }) => name === "nickname")).toMatchObject({ unique: true, nullable: true });
    expect(model.foreignKeys.find(({ name }) => name === "child_parent")).toMatchObject({ dependentColumnIds: expect.arrayContaining([expect.stringContaining("parent_left"), expect.stringContaining("parent_right")]), referencedColumnIds: expect.arrayContaining([expect.stringContaining("left_id"), expect.stringContaining("right_id")]) });
    const document = erdToKnowledgeDocument("erd", "ERD", model);
    expect(document.relations).toHaveLength(model.foreignKeys.length);
    const baseline = createMermaidErd(model);
    expect((baseline.match(/^\s+[A-Z0-9_]+ \{$/gm) ?? [])).toHaveLength(model.tables.length);
    expect((baseline.match(/\|\|--o\{/g) ?? [])).toHaveLength(model.foreignKeys.length);
  });

  it("honors explicit custom schema selection", () => {
    const model = parsePostgresSchema(sql, ["audit"]);
    expect(model.tables.map(({ schema, name }) => `${schema}.${name}`)).toEqual(["audit.event"]);
  });

  it("accepts Supabase pg_dump triggers and unresolved auth references without adding parser stubs to the model", () => {
    const model = parsePostgresSchema(`
      create table public.profile (id uuid primary key, user_id uuid not null);
      alter table only public.profile add constraint profile_user_fkey foreign key (user_id) references auth.users(id);
      create or replace trigger profile_updated before update on public.profile for each row execute function public.set_updated_at();
    `);
    expect(model.tables.map(({ schema, name }) => `${schema}.${name}`)).toEqual(["public.profile"]);
    expect(model.foreignKeys).toHaveLength(0);
    expect(model.diagnostics).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "postgres.trigger-ignored", severity: "info" }),
      expect.objectContaining({ code: "postgres.external-table-stub", severity: "info" }),
      expect.objectContaining({ code: "postgres.external-foreign-key", severity: "warning" }),
    ]));
  });

  it("qualifies invalid SQL without executing it", () => {
    expect(() => parsePostgresSchema("create table nope (", ["public"])).toThrow(/could not be parsed.*line/i);
  });
});
