import useMediaQuery from '~/hooks/useMediaQuery'

type VimeoBlockProps = { src: string; title: string }

export default function VimeoBlock({ video }: { video: VimeoBlockProps }) {
  const isSm = useMediaQuery('(min-width: 640px)')
  const height = isSm ? '500px' : '300px'

  return (
    <div style={{ aspectRatio: '16 / 9', width: '100%' }}>
      <iframe
        src={video.src}
        title={video.title}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}
