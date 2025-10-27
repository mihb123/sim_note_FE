export default function parseMarkdown(text: string) {
  const lines = text.split('\n');
  let html = '';
  let inCodeBlock = false;
  let inList = false;

  lines.forEach(line => {
    if (line.trim() === '') {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += '<br>';
      return;
    }

    // Code blocks (fenced with ```)
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      html += inCodeBlock ? '<pre><code>' : '</code></pre>';
      return;
    }
    if (inCodeBlock) {
      html += line + '\n';
      return;
    }

    // Headings: # Heading -> <h1>, ## -> <h2>, etc.
    // (If you want ALL # lines as <h1>, change to: if (line.startsWith('#')) { html += `<h1>${line.replace(/^#+/, '').trim()}</h1>`; }
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2].trim();
      html += `<h${level}>${content}</h${level}>`;
      return;
    }

    // Unordered lists: - Item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${line.substring(2).trim()}</li>`;
      return;
    } else if (inList) {
      html += '</ul>';
      inList = false;
    }

    // Basic inline: **bold**, *italic*, `code`
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    line = line.replace(/`(.*?)`/g, '<code>$1</code>');

    // Default to paragraph
    html += `<p>${line}</p>`;
  });

  if (inList) html += '</ul>';
  if (inCodeBlock) html += '</code></pre>'; // Close if open

  return html;
}