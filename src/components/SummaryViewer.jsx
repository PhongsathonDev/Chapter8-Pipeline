import React from 'react';
import { BookOpen, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function SummaryViewer({ modules, activeModuleId, searchQuery }) {
  const displayModules = searchQuery
    ? modules.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : modules.filter(m => m.id === activeModuleId);

  // Improved Markdown & HTML parser for headings, code blocks, bold, lists, and modern components
  const renderMarkdown = (content) => {
    if (!content) return null;

    // Separate code blocks from regular text
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', text: content.substring(lastIndex, match.index) });
      }
      segments.push({ type: 'code', text: match[1].trim() });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
      segments.push({ type: 'text', text: content.substring(lastIndex) });
    }

    return segments.map((seg, sIdx) => {
      if (seg.type === 'code') {
        return (
          <div key={`code-${sIdx}`} className="code-block">
            <pre>{seg.text}</pre>
          </div>
        );
      }

      // Split text into HTML blocks and standard markdown chunks
      const blocks = [];
      let rem = seg.text.trim();

      while (rem.length > 0) {
        // Detect HTML block tags
        const htmlMatch = rem.match(/^<(div|table|section|aside|article|figure)(\s[^>]*)?>/i);
        if (htmlMatch) {
          const tag = htmlMatch[1].toLowerCase();
          const tagRegex = new RegExp(`<(\\/)?${tag}(\\s[^>]*)?>`, 'gi');
          let depth = 0;
          let foundEnd = -1;
          let m;
          while ((m = tagRegex.exec(rem)) !== null) {
            if (m[1] === '/') {
              depth--;
              if (depth === 0) {
                foundEnd = tagRegex.lastIndex;
                break;
              }
            } else if (!m[0].endsWith('/>')) {
              depth++;
            }
          }

          if (foundEnd !== -1) {
            blocks.push({ type: 'html', content: rem.substring(0, foundEnd) });
            rem = rem.substring(foundEnd).trim();
            continue;
          }
        }

        // Find the next HTML block start or read until end
        const nextHtml = rem.search(/\n<(div|table|section|aside|article|figure)(\s[^>]*)?>/i);
        const chunk = (nextHtml !== -1) ? rem.substring(0, nextHtml).trim() : rem.trim();
        if (chunk) {
          blocks.push({ type: 'markdown', content: chunk });
        }
        rem = (nextHtml !== -1) ? rem.substring(nextHtml).trim() : '';
      }

      return blocks.map((b, bIdx) => {
        if (b.type === 'html') {
          return (
            <div
              key={`html-${sIdx}-${bIdx}`}
              dangerouslySetInnerHTML={{ __html: b.content }}
            />
          );
        }

        // Parse Markdown chunk lines
        const lines = b.content.split('\n');
        const elements = [];
        let currentList = null;

        lines.forEach((line, lIdx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            if (currentList) {
              elements.push(currentList);
              currentList = null;
            }
            return;
          }

          // Heading 3
          if (trimmed.startsWith('### ')) {
            if (currentList) { elements.push(currentList); currentList = null; }
            elements.push(
              <h3 key={`h3-${sIdx}-${bIdx}-${lIdx}`}>
                {trimmed.replace('### ', '')}
              </h3>
            );
            return;
          }

          // Heading 4
          if (trimmed.startsWith('#### ')) {
            if (currentList) { elements.push(currentList); currentList = null; }
            elements.push(
              <h4 key={`h4-${sIdx}-${bIdx}-${lIdx}`} style={{ color: 'var(--indigo-primary)', margin: '20px 0 10px 0', fontSize: '15px', fontWeight: '700' }}>
                {trimmed.replace('#### ', '')}
              </h4>
            );
            return;
          }

          // Horizontal rule
          if (trimmed === '---') {
            if (currentList) { elements.push(currentList); currentList = null; }
            elements.push(<hr key={`hr-${sIdx}-${bIdx}-${lIdx}`} style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0' }} />);
            return;
          }

          // Unordered list item
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const itemText = trimmed.replace(/^[-*]\s+/, '');
            if (!currentList || currentList.type !== 'ul') {
              if (currentList) elements.push(currentList);
              currentList = { type: 'ul', items: [itemText] };
            } else {
              currentList.items.push(itemText);
            }
            return;
          }

          // Ordered list item
          const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (olMatch) {
            const itemNum = parseInt(olMatch[1], 10);
            const itemText = olMatch[2];
            if (!currentList || currentList.type !== 'ol') {
              if (currentList) elements.push(currentList);
              currentList = { type: 'ol', start: itemNum, items: [{ num: itemNum, text: itemText }] };
            } else {
              currentList.items.push({ num: itemNum, text: itemText });
            }
            return;
          }

          // Regular paragraph
          if (currentList) { elements.push(currentList); currentList = null; }
          elements.push(
            <p key={`p-${sIdx}-${bIdx}-${lIdx}`} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
          );
        });

        if (currentList) {
          elements.push(currentList);
        }

        return elements.map((el, eIdx) => {
          if (el.type === 'ul') {
            return (
              <ul key={`ul-${sIdx}-${bIdx}-${eIdx}`}>
                {el.items.map((it, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it) }} />
                ))}
              </ul>
            );
          }
          if (el.type === 'ol') {
            return (
              <ol key={`ol-${sIdx}-${bIdx}-${eIdx}`} start={el.start}>
                {el.items.map((it, i) => (
                  <li key={i} value={it.num} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it.text) }} />
                ))}
              </ol>
            );
          }
          return el;
        });
      });
    });
  };

  const formatInlineMarkdown = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-family: JetBrains Mono; font-size: 13px;">$1</code>');
  };

  return (
    <main className="summary-viewer">
      {displayModules.map((module) => (
        <article key={module.id} className="content-card">
          <div className="card-header">
            <div className="card-header-left">
              <span className="module-badge">MODULE {module.moduleNumber}</span>
              <h2 className="card-title">{module.title}</h2>
            </div>
            <span className="page-ref-badge">{module.pageRef}</span>
          </div>

          {/* Module Overview / Summary */}
          <div className="callout callout-info" style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'var(--sky-info)', marginRight: '6px' }}>สรุปภาพรวมโมดูล:</strong> {module.summary}
          </div>

          {/* Behavioral Objectives Box (วัตถุประสงค์เชิงพฤติกรรมประจำโมดูล) */}
          {module.objectives && module.objectives.length > 0 && (
            <div className="module-objectives-box">
              <div className="module-objectives-header">
                <CheckCircle2 size={18} color="var(--emerald-success)" />
                <span>วัตถุประสงค์เชิงพฤติกรรมประจำโมดูล:</span>
              </div>
              <ul className="module-objectives-list">
                {module.objectives.map((obj, oIdx) => (
                  <li key={oIdx}>
                    <CheckCircle2 size={15} color="var(--emerald-success)" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose">
            {renderMarkdown(module.content)}
          </div>
        </article>
      ))}

      {displayModules.length === 0 && (
        <div className="content-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ margin: '0 auto 16px auto' }} />
          <h3>ไม่พบข้อมูลที่ตรงกับคำค้นหา "{searchQuery}"</h3>
          <p style={{ color: '#64748b', marginTop: '8px' }}>ลองเปลี่ยนคำค้นหา หรือกดปุ่มรีเซ็ตการค้นหาที่แถบด้านบน</p>
        </div>
      )}
    </main>
  );
}
