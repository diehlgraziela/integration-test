export function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function parseDate(dateString) {
  if (!dateString) return null;

  const [datePart, timePart] = dateString.split(" ");
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split("-");
  const [hour, minute, second] = timePart.split(":");

  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
}

export function getTimeOpen(createdAt) {
  const created = parseDate(createdAt);
  if (!created) return "—";

  const now = new Date();
  const diffMs = now - created;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}min`;
  return `${minutes}min`;
}
