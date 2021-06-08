![goo](https://user-images.githubusercontent.com/601961/120886954-5db29000-c5e8-11eb-8692-f17537b4f5de.png)

A graphical user interface for Solana. Sticks stuff together.

## Features

- Experiment and prototype with different workflows using solana and web2 projects using a visual editor
- GUI to create, import and (soon) build and deploy [Anchor](https://github.com/project-serum/anchor) projects
- Ability to start/stop a local `solana-test-validator` while working on localnet

![Screenshot 2021-06-04 at 8 23 22 PM](https://user-images.githubusercontent.com/601961/120886363-766d7680-c5e5-11eb-8129-64aafb45702c.png)
![Screenshot 2021-06-04 at 8 23 33 PM](https://user-images.githubusercontent.com/601961/120886365-77060d00-c5e5-11eb-9af1-28abd0de69ad.png)

---

## Installation Notes

This has only been tested on macOS so far.

It requires linking a local custom build of [@project-serum/anchor](https://github.com/project-serum/anchor).

https://github.com/johnrees/anchor/tree/electron-0.6.0 I'm pushing it to the main anchor repo shortly so hopefully it'll be more straightforward to install soon.

The interesting stuff is inside `src/renderer`. Actual docs coming soon.
