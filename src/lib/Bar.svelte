<script>
  import * as d3 from 'd3';

  export let data = [];

  let width = 520;
  let height = 340;

  let margin = { top: 40, right: 150, bottom: 80, left: 70 };
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

  $: maxBar = d3.greatest(data, d => d.value);

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

      {#if maxBar}
        <rect
          x={xScale(maxBar.label)}
          y={yScale(maxBar.value)}
          width={xScale.bandwidth()}
          height={innerHeight - yScale(maxBar.value)}
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          rx="10"
        />

        <line
          x1={xScale(maxBar.label) + xScale.bandwidth()}
          y1={yScale(maxBar.value) + (innerHeight - yScale(maxBar.value)) / 2}
          x2={xScale(maxBar.label) + xScale.bandwidth() + 30}
          y2={yScale(maxBar.value) + (innerHeight - yScale(maxBar.value)) / 2}
          stroke="currentColor"
          stroke-width="1.5"
        />

        <text
          x={xScale(maxBar.label) + xScale.bandwidth() + 35}
          y={yScale(maxBar.value) + (innerHeight - yScale(maxBar.value)) / 2}
          dominant-baseline="middle"
          class="annotation">
          Year with most projects
        </text>
      {/if}

      <text
        x={innerWidth / 2}
        y={innerHeight + margin.bottom - 15}
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
    color: var(--text);
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

  .chart-title {
    font-size: 1em;
    font-weight: 700;
    fill: currentColor;
  }

  .axis-label {
    font-size: 0.8em;
    fill: currentColor;
  }

  .annotation {
    font-size: 0.72em;
    fill: currentColor;
    font-style: italic;
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

    .bar-chart {
      max-width: 100%;
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