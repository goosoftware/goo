export const classNames = (...classes: Array<string>) =>
  classes.filter(Boolean).join(" ");
