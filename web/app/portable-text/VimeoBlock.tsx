type VimeoBlockProps = { src: string; title: string }

export default function VimeoBlock({ video }: { video: VimeoBlockProps }) {
  return (
    <div className="aspect-video w-full">
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
