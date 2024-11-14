type PodcastProps = { src: string; title: string }

export default function PodcastBlock({ podcast }: { podcast: PodcastProps }) {
  return <iframe src={podcast.src} title={podcast.title} width="100%" />
}
