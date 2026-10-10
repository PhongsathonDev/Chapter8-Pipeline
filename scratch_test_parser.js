const content = `
### 1. บทนำ
ข้อความปกติที่มี **ตัวหนา** และ \`รหัสโค้ด\`

<div class="table-responsive">
  <table class="modern-table">
    <thead>
      <tr>
        <th>สเตจ</th>
        <th>หน้าที่</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>IF</td>
        <td>Instruction Fetch</td>
      </tr>
    </tbody>
  </table>
</div>

### 2. รายการ
- ข้อที่ 1
- ข้อที่ 2

1. ลำดับที่ 1
2. ลำดับที่ 2
`;

function parseBlocks(raw) {
  // Regex to match code blocks, html block elements, or markdown chunks
  const blocks = [];
  let remaining = raw.trim();

  while (remaining.length > 0) {
    // 1. Check code block
    if (remaining.startsWith('```')) {
      const endIdx = remaining.indexOf('```', 3);
      if (endIdx !== -1) {
        blocks.push({ type: 'code', text: remaining.substring(3, endIdx).trim() });
        remaining = remaining.substring(endIdx + 3).trim();
        continue;
      }
    }

    // 2. Check HTML block (e.g. <div or <table)
    const htmlStartMatch = remaining.match(/^<([a-zA-Z0-9]+)(\s[^>]*)?>/);
    if (htmlStartMatch) {
      const tag = htmlStartMatch[1];
      // Find closing tag </tag>
      const closeTag = `</${tag}>`;
      let depth = 0;
      let pos = 0;
      let foundEnd = -1;
      
      const tagRegex = new RegExp(`<(\/)?${tag}(\\s[^>]*)?>`, 'gi');
      while (true) {
        const m = tagRegex.exec(remaining);
        if (!m) break;
        if (m[1] === '/') {
          depth--;
          if (depth === 0) {
            foundEnd = tagRegex.lastIndex;
            break;
          }
        } else {
          depth++;
        }
      }

      if (foundEnd !== -1) {
        blocks.push({ type: 'html', html: remaining.substring(0, foundEnd) });
        remaining = remaining.substring(foundEnd).trim();
        continue;
      }
    }

    // 3. Normal text until next ``` or HTML tag or end
    const nextCode = remaining.indexOf('```');
    const nextHtmlMatch = remaining.search(/\n<([a-zA-Z0-9]+)(\s[^>]*)?>/);
    let nextBoundary = remaining.length;
    if (nextCode !== -1 && nextCode < nextBoundary) nextBoundary = nextCode;
    if (nextHtmlMatch !== -1 && nextHtmlMatch < nextBoundary) nextBoundary = nextHtmlMatch;

    const textChunk = remaining.substring(0, nextBoundary).trim();
    if (textChunk) {
      blocks.push({ type: 'markdown', text: textChunk });
    }
    remaining = remaining.substring(nextBoundary).trim();
  }

  return blocks;
}

const blocks = parseBlocks(content);
console.log('Total parsed blocks:', blocks.length);
blocks.forEach((b, i) => console.log(`Block ${i + 1}: [${b.type}] -> length: ${b.text?.length || b.html?.length}`));
