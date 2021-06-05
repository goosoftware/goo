import { Chart as ChartJS, registerables } from "chart.js";
import { LGraphNode, LiteGraph } from "litegraph.js";

ChartJS.register(...registerables);

// https://github.com/ai/offscreen-canvas
var offscreen = new OffscreenCanvas(256, 256);
new ChartJS(offscreen, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        animation: false,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

module Chart {
  export class Chart extends LGraphNode {
    title = "chart";
    static title_color = "#C14B4F";
    private rendered = false;

    constructor() {
      super();
      this.size = [256, 256];
    }

    onDrawForeground(ctx: CanvasRenderingContext2D) {
      if (this.flags.collapsed || this.rendered) return;
      ctx.drawImage(offscreen, 0, 0);
    }
  }
}

LiteGraph.registerNodeType("charts/chart", Chart.Chart);
