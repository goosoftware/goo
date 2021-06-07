import { GenIcon } from "react-icons";

export const SolanaIcon = (props) =>
  GenIcon({
    tag: "svg",
    attr: { viewBox: "0 0 398 312" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M65 238c2-3 5-4 9-4h317c6 0 9 7 5 11l-63 63c-2 2-6 4-9 4H7c-6 0-9-7-5-11l63-63zM65 4c2-3 5-4 9-4h317c6 0 9 7 5 11l-63 63c-2 2-6 4-9 4H7c-6 0-9-7-5-12L65 4zM333 120c-2-2-6-4-9-4H7c-6 0-9 7-5 11l63 63c2 2 5 4 9 4h317c6 0 9-7 5-11l-63-63z",
        },
        child: [],
      },
    ],
  })(props);

export const AkashIcon = (props) =>
  GenIcon({
    tag: "svg",
    attr: { viewBox: "0 0 60 56" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M52 54l10-17L41 2H21l31 52zM41 37l11 17H31L21 37h20zM11 19h20L11 54 1 37l10-18z",
        },
        child: [],
      },
    ],
  })(props);

export const ArweaveIcon = (props) =>
  GenIcon({
    tag: "svg",
    attr: { viewBox: "0 0 133.1 133.1" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M77 90a11 11 0 01-1-2 25 25 0 01-1-3 16 16 0 01-2 3 17 17 0 01-3 1 18 18 0 01-4 1 21 21 0 01-4 1 21 21 0 01-7-1 17 17 0 01-6-3 14 14 0 01-4-11q0-8 5-12t18-4h7v-3a7 7 0 00-2-6l-7-2-6 2a6 6 0 00-2 4H46a13 13 0 011-6 15 15 0 014-5 20 20 0 017-3 29 29 0 019-2 31 31 0 018 2 20 20 0 017 3 15 15 0 014 5 17 17 0 012 8v21a36 36 0 000 7 17 17 0 002 4v1zm-12-9a14 14 0 003 0 14 14 0 003-2 10 10 0 002-1 9 9 0 002-2v-9h-6a20 20 0 00-6 1 10 10 0 00-3 1 6 6 0 00-2 3 8 8 0 00-1 3 6 6 0 002 4q2 2 6 2z",
        },
        child: [],
      },
      {
        tag: "circle",
        attr: {
          cx: "66.5",
          cy: "66.5",
          r: "61.7",
          fill: "none",
          stroke: props.color,
          strokeMiterlimit: "10",
          strokeWidth: "9.7",
        },
        child: [],
      },
    ],
  })(props);

export const FlowIcon = (props) =>
  GenIcon({
    tag: "svg",
    attr: { viewBox: "0 0 240 240" },
    child: [
      {
        tag: "path",
        attr: {
          // fillRule: "evenodd",
          // clipRule: "evenodd",
          d: "M2 0a2 2 0 00-2 2v236c0 1.1.9 2 2 2h236a2 2 0 002-2V2a2 2 0 00-2-2H2zm102.28 188.97a23.39 23.39 0 11-31.8-21.68V79.42a36 36 0 0136-36h29.54a23.39 23.39 0 110 16.82h-29.54A19.18 19.18 0 0089.3 79.42v32.18h48.72a23.38 23.38 0 110 16.82H89.3v38.87a23.38 23.38 0 0114.98 21.68zM159.7 58.39a6.57 6.57 0 100-13.13 6.57 6.57 0 000 13.13zm0 68.19a6.57 6.57 0 100-13.14 6.57 6.57 0 000 13.14zm-85.39 62.4a6.57 6.57 0 1013.14 0 6.57 6.57 0 00-13.14 0z",
        },
        child: [],
      },
    ],
  })(props);
