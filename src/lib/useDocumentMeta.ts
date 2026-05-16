import { useEffect } from 'react';

type MetaTag =
  | { name: string; content: string }
  | { property: string; content: string };

/**
 * Imperatively manage <meta> tags in document.head for the lifetime of a component.
 * Restores previous values on unmount.
 */
export function useDocumentMeta(tags: MetaTag[]) {
  useEffect(() => {
    const created: HTMLMetaElement[] = [];
    const restored: Array<{ el: HTMLMetaElement; prev: string }> = [];

    for (const tag of tags) {
      const selector = 'name' in tag
        ? `meta[name="${tag.name}"]`
        : `meta[property="${tag.property}"]`;
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) {
        restored.push({ el, prev: el.getAttribute('content') ?? '' });
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

    return () => {
      for (const { el, prev } of restored) el.setAttribute('content', prev);
      for (const el of created) el.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tags)]);
}
