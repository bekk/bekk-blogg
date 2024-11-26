type PodcastProps = { src: string; title: string }

export default function PodcastBlock({ podcast }: { podcast: PodcastProps }) {
  return (
    <iframe
      src={podcast.src}
      title={podcast.title}
      className="w-full overflow-hidden mb-8"
      // Note: scrolling="no" er deprekert, men det finnes ingen annen måte å få riktig høyde på iframe'en på visstnok
      scrolling="no"
    />
  )
}
