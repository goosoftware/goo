import { shell } from "electron";
import { observer } from "mobx-react-lite";
import React from "react";
import { store } from "../models/Store";

type LinkProps = React.LinkHTMLAttributes<HTMLAnchorElement>;

const ExternalLink: React.FC<LinkProps> = ({
  href,
  title,
  children,
  ...props
}) => (
  <a
    href={href}
    title={title ?? href}
    onClick={(e) => {
      e.preventDefault();
      shell.openExternal(href);
    }}
    {...props}
  >
    {children}
  </a>
);

export const ExplorerLink: React.FC<LinkProps & { path: string }> = observer(
  ({ path, ...props }) => (
    <ExternalLink {...props} href={store.explorerUrl(path)} />
  )
);

export default ExternalLink;
