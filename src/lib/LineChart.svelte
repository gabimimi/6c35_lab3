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
</script>

<div class="line-chart-root">
  <svg
    class="line-chart-svg"
    viewBox="0 0 {width} {height}"
    preserveAspectRatio="xMidYMid meet">
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
    width: min(1100px, 100%);
    margin: 16px auto 0;
  }

  .line-chart-svg {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    overflow: visible;
  }
</style>
