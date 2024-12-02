import { cleanControlCharacters } from 'utils/controlCharacters'

type PodcastProps = { src: string; title: string }

export default function PodcastBlock({ podcast }: { podcast: PodcastProps }) {
  return (
    <iframe
      src={podcast.src}
      title={cleanControlCharacters(podcast.title)}
      className="w-full overflow-hidden h-20"
      // Note: scrolling="no" er deprekert, men det finnes ingen annen måte å få riktig høyde på iframe'en på visstnok
      scrolling="no"
    />
  )
}
