import { shell } from "electron";
import React, { ReactNode } from "react";

const Link = ({
  href,
  title,
  children,
}: {
  href: string;
  title?: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    title={title ?? href}
    onClick={(e) => {
      e.preventDefault();
      shell.openExternal(href);
    }}
  >
    {children}
  </a>
);

export default Link;
