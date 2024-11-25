type QuoteBlockProps = {
  quote?: string
  author?: string
}

export const QuoteBlock = ({ quote, author }: QuoteBlockProps) => {
  if (!quote) {
    return null
  }
  return (
    <blockquote className="p-4 bg-muted ">
      <p className="text-3xl text-muted-foreground italic">{quote}</p>
      {author && <cite className="text-sm text-muted-foreground not-italic"> – {author}</cite>}
    </blockquote>
  )
}
