import {CodePen} from "../../utils/sanity/types/sanity.types";

type CodePenBlockProps = {
  codePen: CodePen
}

export const CodePenBlock = ({codePen}: CodePenBlockProps) => {
  if (!codePen || !codePen.url) {
    return null;
  }
  const url = new URL(codePen.url);
  if (url.hostname !== "codepen.io") {
    console.error(
      `The URL provided was not a CodePen URL. Instead, it was "${url}"`
    );
    return null;
  }
  let [, username, , id] = url.pathname.split("/");
  if (!id) {
    console.error("Could not find the CodePen id from the URL", url);
    return null;
  }
  return (
    <iframe
      height="265"
      style={{width: "100%"}}
      src={`https://codepen.io/${username}/embed/preview/${id}?height=265&theme-id=light&default-tab=css,result`}
      allowTransparency
      allowFullScreen
    />
  );
};
