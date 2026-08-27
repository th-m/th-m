export function PublicationDate({ value, prefix = "" }: { value: string; prefix?: string }) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
  return <time dateTime={value}>{prefix}{formatted}</time>;
}
