<script>
  import * as d3 from 'd3';

  export let data = [];

  let width = 400;
  let height = 300;

  let margin = { top: 40, right: 20, bottom: 50, left: 70 };
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

  $: colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range([
      'var(--accent-color)',
      '#ff6fae',
      '#8b7cff',
      '#c084fc',
      '#5ec8ff'
    ]);

  $: if (xAxis && yAxis) {
    d3.select(xAxis).call(d3.axisBottom(xScale));

    d3.select(yAxis).call(
      d3.axisLeft(yScale)
        .tickFormat(d => Number.isInteger(d) ? d : '')
        .tickValues(d3.range(0, (d3.max(data, d => d.value) || 0) + 1))
    );
  }
</script>

<div class="container">
  <svg class="bar-chart" viewBox="0 0 {width} {height}">
    <text
      x={margin.left + innerWidth / 2}
      y={margin.top / 2}
      text-anchor="middle"
      class="chart-title">
      Projects per Year
    </text>

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
      {#each data as d}
        <rect
          x={xScale(d.label)}
          y={yScale(d.value)}
          width={xScale.bandwidth()}
          height={innerHeight - yScale(d.value)}
          fill={colorScale(d.label)}
          rx="10"
        />
      {/each}

      <text
        x={innerWidth / 2}
        y={innerHeight + margin.bottom - 5}
        text-anchor="middle"
        class="axis-label">
        Year
      </text>

      <text
        x={-(innerHeight / 2)}
        y={-margin.left + 20}
        text-anchor="middle"
        transform="rotate(-90)"
        class="axis-label">
        Number of Projects
      </text>
    </g>
  </svg>

  <ul class="legend">
    {#each data as d}
      <li style="--color: {colorScale(d.label)}">
        <span class="swatch"></span>
        {d.label} <em>({d.value})</em>
      </li>
    {/each}
  </ul>
</div>

<style>
  .container {
    width: min(980px, 100%);
    display: flex;
    align-items: flex-start;
    gap: 24px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 24px;
    margin-bottom: 24px;
  }

  .bar-chart {
    flex: 2;
    max-width: 80%;
    height: auto;
    overflow: visible;
    display: block;
  }

  .legend {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 12px;
    align-content: start;
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text);
    font-size: 0.98rem;
    background: var(--article-bg);
    border: 1px solid var(--article-border);
    border-radius: 14px;
    padding: 10px 12px;
    backdrop-filter: blur(8px);
  }

  .legend em {
    color: var(--muted);
    font-style: normal;
  }

  .swatch {
    width: 12px;
    height: 12px;
    border-radius: 4px;
    background: var(--color);
    flex: 0 0 12px;
  }

  .bar-chart :global(.domain),
  .bar-chart :global(.tick line) {
    stroke: var(--border);
  }

  .bar-chart :global(.tick text) {
    fill: var(--muted);
    font-size: 12px;
  }

  @media (max-width: 800px) {
    .container {
      flex-direction: column;
    }

    .legend {
      width: 100%;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 520px) {
    .legend {
      grid-template-columns: 1fr;
    }
  }
</style>