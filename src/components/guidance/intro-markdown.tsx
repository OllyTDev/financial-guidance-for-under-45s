const INLINE_MARKDOWN_PATTERN = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;

function renderIntroMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = new RegExp(INLINE_MARKDOWN_PATTERN);
  let lastIndex = 0;
  let key = 0;
  let match = pattern.exec(text);

  while (match !== null) {
    const index = match.index;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key++}>{match[2]}</em>);
    }

    lastIndex = index + match[0].length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

interface IntroMarkdownProps {
  text: string;
}

export function IntroMarkdown({ text }: IntroMarkdownProps) {
  return <>{renderIntroMarkdown(text)}</>;
}
