export default function highlightJSX(text: string, keyword: string) {
  if (!keyword) return text;
  const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${esc})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ?
      (<span key={i} className="search_matches px-1">{part}</span>) :
      (<span key={i}>{part}</span>)
  );
}