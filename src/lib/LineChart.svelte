<script>
  import * as d3 from 'd3';

  export let data = [];

  let width = 1000;
  let height = 300;

  let margin = { top: 45, right: 40, bottom: 55, left: 90 };

  $: usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  $: [minDate, maxDate] =
    data.length > 0 ? d3.extent(data, d => d.date) : [undefined, undefined];

  $: xScale =
    minDate instanceof Date &&
    maxDate instanceof Date &&
    !Number.isNaN(minDate.valueOf()) &&
    !Number.isNaN(maxDate.valueOf())
      ? d3
          .scaleTime()
          .domain([minDate, maxDate])
          .range([usableArea.left, usableArea.right])
      : null;

  /** e.g. `"Monday"` when highlighting by weekday; `null` when nothing is hovered. */
  let hoveredDay = null;

  $: dayRegions = (() => {
    if (data.length === 0 || !xScale) return [];
    return data.map((d, i, arr) => {
      const prev = arr[i - 1];
      const next = arr[i + 1];
      const left = prev ? new Date((d.date.getTime() + prev.date.getTime()) / 2) : d.date;
      const right = next ? new Date((d.date.getTime() + next.date.getTime()) / 2) : d.date;

      return {
        date: d.date,
        weekday: d.date.toLocaleString('en', { weekday: 'long' }),
        x: xScale(left),
        width: xScale(right) - xScale(left)
      };
    });
  })();

  $: maxCount = data.length > 0 ? d3.max(data, d => d.count) : 0;

  $: yScale =
    data.length > 0
      ? d3
          .scaleLinear()
          .domain([0, Math.max(maxCount ?? 0, 1)])
          .nice()
          .range([usableArea.bottom, usableArea.top])
      : null;

  $: line =
    xScale && yScale
      ? d3
          .line()
          .x(d => xScale(d.date))
          .y(d => yScale(d.count))
          .curve(d3.curveBumpX)
      : null;

  let xAxis;
  let yAxis;

  $: if (xAxis && yAxis && xScale && yScale) {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(d3.axisLeft(yScale));
  }
</script>

<div class="line-chart-root">
  <h3 class="line-chart-title">Lines Edited by Day</h3>
  <svg
    class="line-chart-svg"
    viewBox="0 0 {width} {height}"
    preserveAspectRatio="xMidYMid meet">
    <g class="x-axis" transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g class="y-axis" transform="translate({usableArea.left}, 0)" bind:this={yAxis} />

    <text
      x={usableArea.left + (usableArea.right - usableArea.left) / 2}
      y={height - 5}
      text-anchor="middle"
      class="axis-label">
      Date
    </text>

    <text
      x={-(usableArea.top + (usableArea.bottom - usableArea.top) / 2)}
      y={10}
      text-anchor="middle"
      transform="rotate(-90)"
      class="axis-label">
      Number of Lines Edited
    </text>

    {#if line && data.length}
      <path
        d={line(data)}
        fill="none"
        stroke="steelblue"
        stroke-width="2"
      />
      {#each data as d}
        <circle
          cx={xScale(d.date)}
          cy={yScale(d.count)}
          r="3"
          fill="steelblue"
        />
      {/each}
    {/if}
  </svg>
</div>

<style>
  .line-chart-root {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
  }

  .line-chart-title {
    margin: 0 0 12px;
    text-align: center;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text);
  }

  .line-chart-svg {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    overflow: visible;
    color: var(--text);
  }

  .axis-label {
    font-size: 0.8em;
    fill: currentColor;
  }

  .line-chart-svg :global(.domain),
  .line-chart-svg :global(.tick line) {
    stroke: var(--border);
  }

  .line-chart-svg :global(.tick text) {
    fill: var(--muted);
    font-size: 12px;
  }
</style>
