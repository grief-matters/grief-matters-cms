import { PreviewProps } from "sanity";

type CastPreviewProps = PreviewProps & {
  from?: string;
  to?: string;
};

function TimePreview(props: PreviewProps) {
  const castProps = props as CastPreviewProps;
  const { from } = castProps;

  return <div>preview of time: {from}</div>;
}

export default TimePreview;
