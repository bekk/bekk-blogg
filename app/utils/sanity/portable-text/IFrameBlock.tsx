import {Iframe} from "../types/sanity.types";

type IFrameBlockProps = {
  iframe: Iframe
};

export default function IFrameBlock({iframe}: IFrameBlockProps) {
  if (!iframe.src) {
    return null;
  }
  return (
    <>
      <iframe
        title={iframe.src}
        src={iframe.src}
        width="100%"
        height={iframe.height || 500}
        allowFullScreen
      />
    </>
  );
}
