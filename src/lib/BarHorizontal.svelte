<script>
  import * as d3 from 'd3';

  export let data = [];
  export let title = '';
  /** When true, no outer card; stack legend under SVG so the chart matches a sibling plot width. */
  export let embedded = false;
  export let width = 620;
  export let height = 280;
  export let margin = { top: 34, right: 96, bottom: 52, left: 84 };

  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;

  $: xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 1])
    .nice()
    .range([0, innerWidth]);

  $: maxLineCount = d3.max(data, d => d.value) ?? 0;
  /** Whole-number ticks only; cap count when totals are large (Step 5.4). */
  $: xAxisTickCount = Math.max(1, Math.min(Math.ceil(maxLineCount), 10));

  $: yScale = d3
    .scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerHeight])
    .padding(0.2);

  $: colorScale = d3
    .scaleOrdinal()
    .domain(data.map(d => d.label))
    .range([
      'var(--accent-color)',
      'var(--accent-pink, #ff6fae)',
      '#8b7cff',
      '#c084fc',
      '#5ec8ff',
      '#7dd3fc',
      '#a78bfa',
      '#f9a8d4'
    ]);

  $: maxBar = d3.greatest(data, d => d.value);

  let xAxis;
  let yAxis;

  $: if (xAxis && yAxis) {
    d3.select(xAxis).call(
      d3.axisBottom(xScale).ticks(xAxisTickCount).tickFormat(d3.format('d'))
    );

    d3.select(yAxis).call(d3.axisLeft(yScale));
  }
</script>

<div class="container" class:embedded>
  <svg class="bar-chart" class:bar-chart--full={embedded} viewBox="0 0 {width} {height}">
    <text
      x={margin.left + innerWidth / 2}
      y={margin.top / 2 + 4}
      text-anchor="middle"
      class="chart-title">
      {title}
    </text>

    <g
      class="x-axis"
      transform="translate({margin.left}, {margin.top + innerHeight})"
      bind:this={xAxis}
    ></g>

    <g class="y-axis" transform="translate({margin.left}, {margin.top})" bind:this={yAxis}></g>

    <g transform="translate({margin.left}, {margin.top})">
      {#each data as d}
        <rect
          x={0}
          y={yScale(d.label)}
          width={xScale(d.value)}
          height={yScale.bandwidth()}
          fill={colorScale(d.label)}
          rx="8"
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
          rx="8"
        />

        <text
          x={xScale(maxBar.value) + 8}
          y={yScale(maxBar.label) + yScale.bandwidth() / 2}
          dominant-baseline="middle"
          text-anchor="start"
          class="annotation">
          Most lines of code
        </text>
      {/if}

      <text
        x={innerWidth / 2}
        y={innerHeight + 20}
        text-anchor="middle"
        class="axis-label">
        <tspan x={innerWidth / 2} dy="0">Number of</tspan>
        <tspan x={innerWidth / 2} dy="1.05em">lines</tspan>
      </text>

      <text
        x={-(innerHeight / 2)}
        y={-margin.left + 18}
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
    width: min(980px, 100%);
    display: flex;
    align-items: flex-start;
    gap: 18px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 18px;
    margin: 18px auto;
  }

  .container.embedded {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
    gap: 14px;
    flex-direction: column;
    align-items: stretch;
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }

  .bar-chart {
    flex: 2;
    max-width: 78%;
    height: auto;
    overflow: visible;
    display: block;
    color: var(--text);
  }

  .bar-chart--full {
    flex: none;
    max-width: 100%;
    width: 100%;
  }

  .container.embedded .legend {
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  }

  .legend {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
    align-content: start;
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text);
    font-size: 0.85rem;
    background: var(--article-bg);
    border: 1px solid var(--article-border);
    border-radius: 12px;
    padding: 8px 10px;
    backdrop-filter: blur(8px);
  }

  .legend em {
    color: var(--muted);
    font-style: normal;
  }

  .swatch {
    width: 11px;
    height: 11px;
    border-radius: 4px;
    background: var(--color);
    flex: 0 0 11px;
  }

  .chart-title {
    font-size: 0.88rem;
    font-weight: 700;
    fill: currentColor;
  }

  .axis-label {
    font-size: 0.68rem;
    fill: currentColor;
  }

  .annotation {
    font-size: 0.62rem;
    fill: currentColor;
    font-style: italic;
  }

  .bar-chart :global(.domain),
  .bar-chart :global(.tick line) {
    stroke: var(--border);
  }

  .bar-chart :global(.tick text) {
    fill: var(--muted);
    font-size: 10px;
  }

  @media (max-width: 900px) {
    .container:not(.embedded) {
      flex-direction: column;
    }

    .container:not(.embedded) .bar-chart {
      max-width: 100%;
    }

    .container:not(.embedded) .legend {
      width: 100%;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 520px) {
    .container:not(.embedded) .legend {
      grid-template-columns: 1fr;
    }

    .container.embedded .legend {
      grid-template-columns: 1fr;
    }
  }
</style>
