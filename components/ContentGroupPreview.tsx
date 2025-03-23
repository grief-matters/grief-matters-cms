import { BlockElementIcon, DashboardIcon } from "@sanity/icons";
import React from "react";

interface IProps {
  slug?: string;
}

const ContentGroupPreview = (props: IProps) => {
  const isPage = `${props.slug ?? ""}`.length > 0;

  return isPage ? <DashboardIcon /> : <BlockElementIcon />;
};

export default ContentGroupPreview;
