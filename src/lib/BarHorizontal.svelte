<script>
  import * as d3 from 'd3';

  export let data = [];
  export let title = 'Lines of Code per Language';

  let width = 700;
  let height = 380;

  let margin = { top: 45, right: 170, bottom: 55, left: 90 };
  let innerWidth = width - margin.left - margin.right;
  let innerHeight = height - margin.top - margin.bottom;

  let xAxis;
  let yAxis;

  $: xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 1])
    .nice()
    .range([0, innerWidth]);

  $: yScale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerHeight])
    .padding(0.2);

  $: colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range([
      'var(--accent-color)',
      '#ff6fae',
      '#8b7cff',
      '#c084fc',
      '#5ec8ff',
      '#7dd3fc',
      '#a78bfa',
      '#f9a8d4'
    ]);

  $: maxBar = d3.greatest(data, d => d.value);

  $: if (xAxis && yAxis) {
    d3.select(xAxis).call(
        d3.axisBottom(xScale)
        .ticks(6)
        .tickFormat(d3.format('~s'))
    );

    d3.select(yAxis).call(d3.axisLeft(yScale));
    }
</script>

<div class="container">
  <svg class="bar-chart" viewBox="0 0 {width} {height}">
    <text
      x={margin.left + innerWidth / 2}
      y={margin.top / 2}
      text-anchor="middle"
      class="chart-title">
      {title}
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
          x={0}
          y={yScale(d.label)}
          width={xScale(d.value)}
          height={yScale.bandwidth()}
          fill={colorScale(d.label)}
          rx="10"
        />
      {/each}

      {#if maxBar}
        <rect
          x={0}
          y={yScale(maxBar.label)}
          width={xScale(maxBar.value)}
          height={yScale.bandwidth()}
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          rx="10"
        />

        <line
          x1={xScale(maxBar.value)}
          y1={yScale(maxBar.label) + yScale.bandwidth() / 2}
          x2={xScale(maxBar.value) + 30}
          y2={yScale(maxBar.label) + yScale.bandwidth() / 2}
          stroke="currentColor"
          stroke-width="1.5"
        />

        <text
          x={xScale(maxBar.value) + 35}
          y={yScale(maxBar.label) + yScale.bandwidth() / 2}
          dominant-baseline="middle"
          class="annotation">
          Most lines of code
        </text>
      {/if}

      <text
        x={innerWidth / 2}
        y={innerHeight + margin.bottom - 10}
        text-anchor="middle"
        class="axis-label">
        Number of Lines
      </text>

      <text
        x={-(innerHeight / 2)}
        y={-margin.left + 20}
        text-anchor="middle"
        transform="rotate(-90)"
        class="axis-label">
        Language
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
    width: min(1100px, 100%);
    display: flex;
    align-items: flex-start;
    gap: 24px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 24px;
    margin: 24px auto;
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

  @media (max-width: 900px) {
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