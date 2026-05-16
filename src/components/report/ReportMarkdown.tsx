import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props { markdown: string; }

export function ReportMarkdown({ markdown }: Props) {
  return useMemo(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => (
          <p className="font-sans text-[18px] leading-[1.65] text-foreground mb-5" {...props} />
        ),
        h1: ({ node, ...props }) => (
          <h1 className="font-display text-[36px] leading-[1.15] text-primary mt-16 mb-6" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="font-display text-[30px] leading-[1.2] text-primary mt-14 mb-5" {...props} />
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
      }}
    >
      {markdown}
    </ReactMarkdown>
  ), [markdown]);
}
