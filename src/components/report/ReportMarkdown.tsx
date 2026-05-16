import { useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Props { markdown: string; }

interface Section {
  id: string;
  title: string;
  body: string;
}

const markdownComponents: Components = {
  p: ({ node, ...props }) => (
    <p className="font-sans text-[18px] leading-[1.65] text-foreground mb-5" {...props} />
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
    <li className="font-sans text-[18px] leading-[1.65] text-foreground pt-1" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-accent pl-4 italic text-muted-foreground my-6" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className="underline text-primary hover:opacity-80" {...props} />
  ),
  hr: () => <hr className="my-10 border-border" />,
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

export function ReportMarkdown({ markdown }: Props) {
  return useMemo(() => {
    const { intro, sections } = splitSections(markdown);

    // Print: render everything flat so the PDF doesn't have collapsed sections.
    const printOnly = (
      <div className="hidden print:block">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
          ...markdownComponents,
          h2: ({ node, ...props }) => (
            <h2 className="font-display text-[30px] leading-[1.2] text-primary mt-14 mb-5" {...props} />
          ),
        }}>
          {markdown}
        </ReactMarkdown>
      </div>
    );

    // No H2 headings? Just render flat.
    if (sections.length === 0) {
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
          ...markdownComponents,
          h2: ({ node, ...props }) => (
            <h2 className="font-display text-[30px] leading-[1.2] text-primary mt-14 mb-5" {...props} />
          ),
        }}>
          {markdown}
        </ReactMarkdown>
      );
    }

    return (
      <>
        {printOnly}
        <div className="print:hidden">
          {intro && (
            <div className="mb-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {intro}
              </ReactMarkdown>
            </div>
          )}
          <Accordion
            type="multiple"
            defaultValue={sections.length > 0 ? [sections[0].id] : []}
            className="w-full"
          >
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="font-display text-[24px] md:text-[28px] leading-[1.25] text-primary py-6 text-left hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="pb-8 pt-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {section.body}
                  </ReactMarkdown>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </>
    );
  }, [markdown]);
}
