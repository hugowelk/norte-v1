import { useEffect } from 'react';

type MetaTag =
  | { name: string; content: string }
  | { property: string; content: string };

interface PageHead {
  title?: string;
  canonical?: string;
}

/**
 * Imperatively manage <meta> tags (and optionally <title> + canonical link)
 * in document.head for the lifetime of a component. Restores previous values
 * on unmount.
 */
export function useDocumentMeta(tags: MetaTag[], head?: PageHead) {
  useEffect(() => {
    const created: HTMLElement[] = [];
    const restored: Array<{ el: HTMLElement; attr: string; prev: string }> = [];
    let prevTitle: string | null = null;

    for (const tag of tags) {
      const selector = 'name' in tag
        ? `meta[name="${tag.name}"]`
        : `meta[property="${tag.property}"]`;
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) {
        restored.push({ el, attr: 'content', prev: el.getAttribute('content') ?? '' });
        el.setAttribute('content', tag.content);
      } else {
        el = document.createElement('meta');
        if ('name' in tag) el.setAttribute('name', tag.name);
        else el.setAttribute('property', tag.property);
        el.setAttribute('content', tag.content);
        document.head.appendChild(el);
        created.push(el);
      }
    }

    if (head?.title) {
      prevTitle = document.title;
      document.title = head.title;
    }

    if (head?.canonical) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (link) {
        restored.push({ el: link, attr: 'href', prev: link.getAttribute('href') ?? '' });
        link.setAttribute('href', head.canonical);
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', head.canonical);
        document.head.appendChild(link);
        created.push(link);
      }
    }

    return () => {
      for (const { el, attr, prev } of restored) el.setAttribute(attr, prev);
      for (const el of created) el.remove();
      if (prevTitle !== null) document.title = prevTitle;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tags), head?.title, head?.canonical]);
}
