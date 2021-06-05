import { shell } from "electron";
import React from "react";

const ExternalLink: React.FC<React.LinkHTMLAttributes<HTMLAnchorElement>> = ({
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

export default ExternalLink;
