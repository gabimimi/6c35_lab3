<script>
  import * as d3 from 'd3';

  let width = 400;
  let height = 300;

  let data = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 15 },
    { label: 'D', value: 8 },
    { label: 'E', value: 25 }
  ];

  let margin = { top: 20, right: 20, bottom: 30, left: 60 };
  let innerWidth = width - margin.left - margin.right;
  let innerHeight = height - margin.top - margin.bottom;

  let xAxis;
  let yAxis;

  $: xScale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerWidth])
    .padding(0.2);

  $: yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 1])
    .nice()
    .range([innerHeight, 0]);

  $: if (xAxis && yAxis) {
    d3.select(xAxis).call(d3.axisBottom(xScale).tickSizeOuter(0));
    d3.select(yAxis).call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0));
  }
</script>

<svg class="bar-chart" viewBox="0 0 {width} {height}">
  <g
    class="x-axis"
    transform="translate({margin.left}, {margin.top + innerHeight})"
    bind:this={xAxis}
  ></g>

  <g
    class="y-axis"
    transform="translate({margin.left}, {margin.top})"
    bind:this={yAxis}
  ></g>

  <g transform="translate({margin.left}, {margin.top})">
    {#each data as d, i}
      <rect
        class="bar bar-{i % 5}"
        x={xScale(d.label)}
        y={yScale(d.value)}
        width={xScale.bandwidth()}
        height={innerHeight - yScale(d.value)}
        rx="10"
      />
    {/each}
  </g>
</svg>

<style>
  .bar-chart {
    max-width: 100%;
    height: auto;
    overflow: visible;
    display: block;
  }

  .bar {
    transition: opacity 160ms ease, transform 160ms ease;
    transform-origin: center bottom;
  }

  .bar:hover {
    opacity: 0.9;
  }

  .bar-0 { fill: var(--accent-color); }
  .bar-1 { fill: #ff6fae; }
  .bar-2 { fill: #8b7cff; }
  .bar-3 { fill: #c084fc; }
  .bar-4 { fill: #5ec8ff; }

  .bar-chart :global(.domain),
  .bar-chart :global(.tick line) {
    stroke: var(--border);
  }

  .bar-chart :global(.tick text) {
    fill: var(--muted);
    font-size: 12px;
  }

  .bar-chart :global(.y-axis .tick line) {
    stroke-opacity: 0.35;
  }
</style>