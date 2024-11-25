type VimeoBlockProps = { src: string; title: string }

export default function VimeoBlock({ video }: { video: VimeoBlockProps }) {
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
