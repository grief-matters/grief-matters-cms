import { BlockElementIcon, DashboardIcon } from "@sanity/icons";

interface IProps {
  slug?: string;
}

const ContentGroupPreview = (props: IProps) => {
  const isPage = `${props.slug ?? ""}`.length > 0;

  return isPage ? <DashboardIcon /> : <BlockElementIcon />;
};

export default ContentGroupPreview;
