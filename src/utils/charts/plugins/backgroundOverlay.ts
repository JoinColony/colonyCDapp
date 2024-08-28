export const backgroundOverlayPlugin = {
  id: 'backgroundOverlayPlugin',
  beforeDatasetsDraw: (chart, _, options) => {
    const { ctx, chartArea, data } = chart;
    const { hoverBackgroundColor } = options;

    if (!data.datasets.length) return;

    const { top, bottom } = chartArea;

    // Determine if both bars in the datasets are hovered
    const firstHoveredBar = chart
      .getDatasetMeta(0)
      .data.find((bar) => bar.active);
    const secondHoveredBar = chart
      .getDatasetMeta(1)
      .data.find((bar) => bar.active);

    if (!firstHoveredBar || !secondHoveredBar) return;

    // Calculate the start and end positions of the group overlay
    const groupStart = firstHoveredBar.x - firstHoveredBar.width / 2 - 10;
    const groupEnd = secondHoveredBar.x + secondHoveredBar.width / 2 + 10;
    const radius = 4;

    ctx.save();
    ctx.fillStyle = hoverBackgroundColor || 'rgba(0, 0, 0, 0.1)';
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.moveTo(groupStart + radius, top); // Move to the start point of the rounded corner
    ctx.arcTo(groupEnd, top, groupEnd, top + radius, radius); // Top-right corner
    ctx.lineTo(groupEnd, bottom, groupEnd - radius, bottom, radius); // Bottom-right corner (straight)
    ctx.lineTo(groupStart, bottom, groupStart, bottom - radius, radius); // Bottom-left corner (straight)
    ctx.arcTo(groupStart, top, groupStart + radius, top, radius); // Top-left corner
    ctx.closePath();

    ctx.fill();
    ctx.restore();
  },
};
