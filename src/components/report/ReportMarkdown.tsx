import { useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Props { markdown: string; }

interface Section {
  id: string;
  title: string;
  body: string;
}

const baseComponents: Components = {
  p: ({ node, ...props }) => (
    <p className="font-sans text-[17px] md:text-[18px] leading-[1.7] text-foreground mb-5" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="font-display text-[28px] md:text-[32px] leading-[1.2] text-primary mt-12 mb-6" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="font-display text-[22px] leading-[1.3] text-primary mt-10 mb-3" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-semibold text-accent" {...props} />
  ),
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-5 space-y-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-5 space-y-4" {...props} />,
  li: ({ node, ...props }) => (
    <li className="font-sans text-[17px] md:text-[18px] leading-[1.7] text-foreground pt-1" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-accent pl-4 italic text-muted-foreground my-6" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className="underline text-primary hover:opacity-80" {...props} />
  ),
  hr: () => <hr className="my-10 border-border" />,
};

// Section 5: render ordered list items as cards.
const shiftsComponents: Components = {
  ...baseComponents,
  ol: ({ node, ...props }) => (
    <ol className="list-none pl-0 mt-6 mb-5 grid gap-4" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li
      className="rounded-xl border border-border bg-card/40 px-6 py-5 md:px-7 md:py-6 font-sans text-[17px] md:text-[18px] leading-[1.7] text-foreground [&>p]:mb-0 [&>p+p]:mt-3 [&>strong:first-child]:block [&>strong:first-child]:font-display [&>strong:first-child]:text-[20px] [&>strong:first-child]:md:text-[22px] [&>strong:first-child]:text-primary [&>strong:first-child]:mb-2 [&>strong:first-child]:font-normal"
      {...props}
    />
  ),
};

// Section 7: questions get more breathing room and a touch larger.
const questionsComponents: Components = {
  ...baseComponents,
  p: ({ node, ...props }) => (
    <p className="font-sans text-[19px] md:text-[21px] leading-[1.7] text-foreground mt-8 first:mt-2 mb-0" {...props} />
  ),
};

function splitSections(markdown: string): { intro: string; sections: Section[] } {
  const lines = markdown.split('\n');
  let intro = '';
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      if (current) sections.push(current);
      current = { id: `s-${sections.length}`, title: m[1].trim(), body: '' };
    } else if (current) {
      current.body += (current.body ? '\n' : '') + line;
    } else {
      intro += (intro ? '\n' : '') + line;
    }
  }
  if (current) sections.push(current);

  return {
    intro: intro.trim(),
    sections: sections.map(s => ({ ...s, body: s.body.trim() })),
  };
}

function pickComponents(title: string): Components {
  const t = title.toLowerCase();
  if (t.includes('behaviour shift') || t.includes('behavior shift')) return shiftsComponents;
  if (t.includes('questions to sit with')) return questionsComponents;
  return baseComponents;
}

export function ReportMarkdown({ markdown }: Props) {
  return useMemo(() => {
    const { intro, sections } = splitSections(markdown);

    // Print: render everything flat.
    const printOnly = (
      <div className="hidden print:block">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={baseComponents}>
          {markdown}
        </ReactMarkdown>
      </div>
    );

    if (sections.length === 0) {
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={baseComponents}>
          {markdown}
        </ReactMarkdown>
      );
    }

    return (
      <>
        {printOnly}
        <div className="print:hidden">
          {intro && (
            <div className="mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={baseComponents}>
                {intro}
              </ReactMarkdown>
            </div>
          )}
          {sections.map((section, idx) => (
            <section key={section.id} className="scroll-mt-24">
              {idx > 0 && (
                <hr className="my-10 md:my-14 border-0 border-t border-border/60" />
              )}
              <h2 className="font-display text-[28px] md:text-[32px] leading-[1.2] text-primary mt-2 mb-6">
                {section.title}
              </h2>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={pickComponents(section.title)}
              >
                {section.body}
              </ReactMarkdown>
            </section>
          ))}
        </div>
      </>
    );
  }, [markdown]);
}
