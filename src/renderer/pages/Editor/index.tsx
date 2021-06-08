import { LGraph, LGraphCanvas, LiteGraph } from "litegraph.js";
import React, { useEffect, useRef } from "react";
import "./litegraph.css";

declare global {
  interface Window {
    graph: LGraph;
    canvas: LGraphCanvas;
    render: () => void;
  }
}

const RENDER_LOOP = true;
const EXECUTION_LOOP = true;
class Graph extends LGraph {
  // onNodeAdded(node: LGraphNode) {
  //   console.log("added", node);
  //   console.log(this);
  // }
}

function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const LOCAL_STORAGE_KEY = `graph:${"id"}`;

  useEffect(() => {
    if (!canvasRef.current) return;

    var graph = new Graph();
    window.graph = graph;

    const handleResize = () => {
      canvas.resize();
    };

    const handleUnload = () => {
      const data = graph.serialize();
      data.nodes = data.nodes.map((node: any) => {
        delete node.size;
        return node;
      });

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    };

    const canvas = new LGraphCanvas(canvasRef.current, graph);

    // https://github.com/IBM/plex/tree/master/IBM-Plex-Sans-Condensed
    // https://rubjo.github.io/victor-mono/
    // https://www.programmingfonts.org/

    // canvas.title_text_font = `${LiteGraph.NODE_TEXT_SIZE}px JetBrains Mono`;
    canvas.title_text_font = `${
      LiteGraph.NODE_TEXT_SIZE + 1
    }px IBMPlexSansCond-Medm`;

    canvas.node_title_color = "white";
    canvas.inner_text_font = `${LiteGraph.NODE_SUBTEXT_SIZE}px JetBrains Mono`;
    canvas.background_image = undefined;

    // canvas.inner_text_font = `${LiteGraph.NODE_SUBTEXT_SIZE}px JetBrains Mono`;
    // canvas.inner_text_font = `${LiteGraph.NODE_SUBTEXT_SIZE}px IBMPlexSansCond`;
    canvas.zoom_modify_alpha = false;
    canvas.render_canvas_border = false;
    canvas.render_connection_arrows = false;
    canvas.render_shadows = false;
    canvas.always_render_background = false;
    canvas.ds.max_scale = 2;
    canvas.ds.min_scale = 0.15;
    // canvas.onNodeSelected = () => canvas.canvas.focus();

    handleResize();

    window.canvas = canvas;

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("beforeunload", handleUnload, { capture: true });

    // document.removeEventListener("keyup", (canvas as any)._key_callback, true);
    // window.addEventListener("keyup", canvas.processKey.bind(canvas), true);
    // console.log((canvas as any)._key_callback)

    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
        const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        graph.configure(data);
      }
    } catch (err) {}

    if (!RENDER_LOOP) canvas.stopRendering();
    if (EXECUTION_LOOP) graph.start();

    const keyCallback = (canvas as any)._key_callback;

    // Remove existing key listeners

    // https://github.com/jagenjo/litegraph.js/blob/b6fc5713248c8c581963ab986e458993b210242e/src/litegraph.js#L5046
    canvas.canvas.removeEventListener("keydown", keyCallback, true);
    document.removeEventListener("keyup", keyCallback, true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "MetaRight" && !EXECUTION_LOOP) {
        return render();
      } else {
        return keyCallback(e);
      }
    };

    // Add new key listeners

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", keyCallback);

    window.onblur = () => window.focus();

    if (!EXECUTION_LOOP) render();

    return () => {
      // HMR
      handleUnload();

      // Remove new key listeners

      // window.removeEventListener("keydown", handleKeyDown);
      // window.removeEventListener("keyup", keyCallback);

      window.removeEventListener("resize", handleResize);
      window.addEventListener("beforeunload", handleUnload);
    };
  }, [LOCAL_STORAGE_KEY]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

const render = () => {
  if (!RENDER_LOOP) window.canvas.startRendering();

  if (!EXECUTION_LOOP) {
    window.graph.runStep(1);

    console.log("render");

    document
      .getElementsByTagName("canvas")[0]
      .dispatchEvent(new Event("keydown"));
  }

  if (!RENDER_LOOP) window.canvas.stopRendering();
};

export default Editor;
