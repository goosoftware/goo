import { shell } from "electron";
import { observer } from "mobx-react-lite";
import React from "react";
import { store } from "../models/Store";

type LinkProps = React.LinkHTMLAttributes<HTMLAnchorElement>;

/**
 * Creates an <a /> that opens in a separate web browser
 */
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

/**
 * Creates an <a /> to explorer.solana.com for the
 * current cluster use a {path} param like
 * "address/Stake11111111111111111111111111111111111111"
 */
export const ExplorerLink: React.FC<LinkProps & { path: string }> = observer(
  ({ path, ...props }) => (
    <ExternalLink {...props} href={store.explorerUrl(path)} />
  )
);

export default ExternalLink;
