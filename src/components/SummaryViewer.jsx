import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function SummaryViewer({ modules, activeModuleId, searchQuery }) {
  const displayModules = searchQuery
    ? modules.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : modules.filter(m => m.id === activeModuleId);

  // Enhanced Markdown and Rich HTML parser for headings, modern components, tables, code blocks, bold, and lists
  const renderMarkdown = (content) => {
    if (!content) return null;

    // Step 1: Pre-process lines to separate raw multiline HTML blocks, code blocks, and regular markdown text
    const lines = content.split('\n');
    const sections = [];
    let currentHtmlLines = [];
    let htmlTagDepth = 0;
    let inCodeBlock = false;
    let currentCodeLines = [];
    let currentTextLines = [];

    const flushText = () => {
      if (currentTextLines.length > 0) {
        sections.push({ type: 'text', lines: [...currentTextLines] });
        currentTextLines = [];
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Handle Code Blocks
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          sections.push({ type: 'code', text: currentCodeLines.join('\n') });
          currentCodeLines = [];
          inCodeBlock = false;
        } else {
          flushText();
          inCodeBlock = true;
        }
        return;
      }
      if (inCodeBlock) {
        currentCodeLines.push(line);
        return;
      }

      // Check for HTML block start or continuation
      const openMatches = line.match(/<(?:div|table|section|article)\b[^>]*>/gi) || [];
      const closeMatches = line.match(/<\/(?:div|table|section|article)>/gi) || [];

      if (openMatches.length > 0 && htmlTagDepth === 0) {
        flushText();
      }

      if (openMatches.length > 0 || htmlTagDepth > 0) {
        htmlTagDepth += (openMatches.length - closeMatches.length);
        currentHtmlLines.push(line);
        if (htmlTagDepth <= 0) {
          sections.push({ type: 'html', html: currentHtmlLines.join('\n') });
          currentHtmlLines = [];
          htmlTagDepth = 0;
        }
        return;
      }

      currentTextLines.push(line);
    });

    flushText();
    if (currentHtmlLines.length > 0) {
      sections.push({ type: 'html', html: currentHtmlLines.join('\n') });
    }

    // Step 2: Render each section according to its type
    return sections.map((sec, sIdx) => {
      if (sec.type === 'code') {
        return (
          <div key={`sec-code-${sIdx}`} className="code-block">
            <pre>{sec.text}</pre>
          </div>
        );
      }

      if (sec.type === 'html') {
        return (
          <div
            key={`sec-html-${sIdx}`}
            className="embedded-html-block"
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(sec.html) }}
          />
        );
      }

      // Process lines in regular text blocks
      const elements = [];
      let currentList = null;

      sec.lines.forEach((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          if (currentList) {
            elements.push(currentList);
            currentList = null;
          }
          return;
        }

        // Display Math Formula ($$ formula $$)
        if (trimmed.startsWith('$$')) {
          if (currentList) { elements.push(currentList); currentList = null; }
          let formulaText = trimmed;
          if (formulaText.endsWith('$$') && formulaText.length > 4) {
            formulaText = formulaText.slice(2, -2).trim();
          } else {
            formulaText = formulaText.replace(/^(\$\$)+/, '').trim();
          }
          elements.push(
            <div
              key={`formula-${sIdx}-${lIdx}`}
              className="formula-box"
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(formulaText) }}
            />
          );
          return;
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          if (currentList) { elements.push(currentList); currentList = null; }
          elements.push(
            <h3 key={`h3-${sIdx}-${lIdx}`}>
              {trimmed.replace('### ', '')}
            </h3>
          );
          return;
        }

        // Heading 4
        if (trimmed.startsWith('#### ')) {
          if (currentList) { elements.push(currentList); currentList = null; }
          elements.push(
            <h4 key={`h4-${sIdx}-${lIdx}`} style={{ color: '#4f46e5', margin: '20px 0 10px 0', fontSize: '15px', fontWeight: '700' }}>
              {trimmed.replace('#### ', '')}
            </h4>
          );
          return;
        }

        // HR
        if (trimmed === '---') {
          if (currentList) { elements.push(currentList); currentList = null; }
          elements.push(<hr key={`hr-${sIdx}-${lIdx}`} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />);
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

        // Paragraph
        if (currentList) { elements.push(currentList); currentList = null; }
        elements.push(
          <p key={`p-${sIdx}-${lIdx}`} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
        );
      });

      if (currentList) {
        elements.push(currentList);
      }

      return elements.map((el, eIdx) => {
        if (el.type === 'ul') {
          return (
            <ul key={`list-${sIdx}-${eIdx}`}>
              {el.items.map((it, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it) }} />
              ))}
            </ul>
          );
        }
        if (el.type === 'ol') {
          return (
            <ol key={`list-${sIdx}-${eIdx}`} start={el.start}>
              {el.items.map((it, i) => (
                <li key={i} value={it.num} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it.text) }} />
              ))}
            </ol>
          );
        }
        return el;
      });
    });
  };

  const formatInlineMarkdown = (str) => {
    if (!str) return '';
    return str
      // LaTeX text blocks: \text{...} -> ...
      .replace(/\\text\{([^}]+)\}/g, '$1')
      // LaTeX bold blocks: \mathbf{...} -> <strong>$1</strong>
      .replace(/\\mathbf\{([^}]+)\}/g, '<strong>$1</strong>')
      // LaTeX fractions: \frac{A}{B} -> (A) / (B)
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')
      // LaTeX math operators and symbols
      .replace(/\\times/g, '×')
      .replace(/\\cdot/g, '·')
      .replace(/\\oplus/g, '⊕')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\le/g, '≤')
      .replace(/\\ge/g, '≥')
      .replace(/\\pmod\{([^}]+)\}/g, 'mod $1')
      .replace(/\\pmod\s+([a-zA-Z0-9_]+)/g, 'mod $1')
      .replace(/\\quad/g, ' &nbsp; ')
      // Math powers with curly braces: 2^{16} or 2^{n-1} or 2^{(E - Bias)} -> 2<sup>...</sup>
      .replace(/([0-9a-zA-Z)\]])\^\{([^}]+)\}/g, '$1<sup>$2</sup>')
      // Math powers simple: 2^n or 2^2 or 2^N -> 2<sup>n</sup>
      .replace(/([0-9a-zA-Z)\]])\^([0-9a-zA-Z+-]+)/g, '$1<sup>$2</sup>')
      // Math subscripts with curly braces: A_{10} or X_{in} -> A<sub>...</sub>
      .replace(/([0-9a-zA-Z)\]])_\{([^}]+)\}/g, '$1<sub>$2</sub>')
      // Math subscripts simple: 101_2 or Q_0 or FA_0 -> 101<sub>2</sub>
      .replace(/([0-9a-zA-Z)\]])_([0-9a-zA-Z]+)/g, '$1<sub>$2</sub>')
      // Strip remaining LaTeX $$ or $ delimiters
      .replace(/\$\$/g, '')
      .replace(/\$/g, '')
      // Standard markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
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

          <div className="callout callout-info" style={{ marginBottom: '24px' }}>
            <div className="callout-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#0284c7', fontWeight: '700' }}>
              <Info size={18} />
              <span>สรุปภาพรวมโมดูล</span>
            </div>
            <div className="callout-body">
              <strong>สาระสำคัญ:</strong> {module.summary}
            </div>
          </div>

          {module.objectives && module.objectives.length > 0 && (
            <div className="module-objectives-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#4f46e5', fontWeight: '700', fontSize: '14px' }}>
                <CheckCircle2 size={18} />
                <span>วัตถุประสงค์เชิงพฤติกรรมประจำโมดูล:</span>
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '13.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {module.objectives.map((obj, oIdx) => (
                  <li key={oIdx}><strong>{obj.code}:</strong> {obj.text}</li>
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
