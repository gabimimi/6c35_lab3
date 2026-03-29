<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import BarHorizontal from '$lib/BarHorizontal.svelte';

  // Match BarHorizontal chart frame
  let width = 700;
  let height = 380;

  let margin = { top: 45, right: 40, bottom: 55, left: 90 };

  $: usableArea = (() => {
    const top = margin.top;
    const right = width - margin.right;
    const bottom = height - margin.bottom;
    const left = margin.left;
    return {
      top,
      right,
      bottom,
      left,
      width: right - left,
      height: bottom - top
    };
  })();

  let xAxis;
  let yAxis;
  let yAxisGridlines;

  let locData = [];
  let commits = [];

  onMount(async () => {
    locData = await d3.csv(`${base}/loc.csv`, row => ({
      ...row,
      line: Number(row.line),
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime)
    }));

    commits = d3.groups(locData, d => d.commit).map(([commit, lines]) => {
      const first = lines[0];
      const { author, date, time, timezone, datetime } = first;
      return {
        id: commit,
        url: 'https://github.com/vis-society/lab-7/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
        lines
      };
    });
  });

  // Thanks to Nathanael Jenkins for flagging this to us!
  // Single derived maxDatePlusOne (new Date) so Svelte/d3 always see a consistent domain;
  // splitting assignment + in-place setDate() can run xScale before the +1 day mutation.
  $: [minDate, maxDate] =
    commits.length > 0 ? d3.extent(commits.map(d => d.date)) : [undefined, undefined];
  $: maxDatePlusOne =
    maxDate instanceof Date && !Number.isNaN(maxDate.valueOf())
      ? d3.timeDay.offset(maxDate, 1)
      : undefined;

  $: xScale =
    minDate instanceof Date &&
    maxDatePlusOne instanceof Date &&
    !Number.isNaN(minDate.valueOf()) &&
    !Number.isNaN(maxDatePlusOne.valueOf())
      ? d3
          .scaleTime()
          .domain([minDate, maxDatePlusOne])
          .range([usableArea.left, usableArea.right])
          .nice()
      : null;

  $: yScale = d3
    .scaleLinear()
    .domain([24, 0])
    .range([usableArea.bottom, usableArea.top]);

  $: [minTotalLines, maxTotalLines] =
    commits.length > 0 ? d3.extent(commits.map(d => d.totalLines)) : [undefined, undefined];
  $: rScale =
    commits.length > 0 &&
    minTotalLines != null &&
    maxTotalLines != null &&
    Number.isFinite(minTotalLines) &&
    Number.isFinite(maxTotalLines)
      ? d3
          .scaleLinear()
          .domain(
            minTotalLines === maxTotalLines
              ? [minTotalLines - 1, maxTotalLines + 1]
              : [minTotalLines, maxTotalLines]
          )
          .range([5, 30])
      : null;

  $: if (xAxis && yAxis && yAxisGridlines && xScale && yScale) {
    d3.select(yAxisGridlines).call(
      d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width)
    );
    d3.select(yAxisGridlines).select('.domain').remove();
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(
      d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, '0') + ':00')
    );
  }

  $: languageData = d3.rollups(
    locData,
    v => v.length,
    d => d.type
  )
    .map(([language, count]) => ({
      label: String(language),
      value: count
    }))
    .sort((a, b) => b.value - a.value);
</script>

<svelte:head>
  <title>Meta</title>
</svelte:head>

<h1>Meta</h1>

<div class="scatter-panel">
  <svg class="scatter-chart" viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet">
    <text
      x={margin.left + usableArea.width / 2}
      y={margin.top / 2}
      text-anchor="middle"
      class="chart-title">
      Commits by time of day
    </text>

    <g class="x-axis" transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g
      class="gridlines"
      transform="translate({usableArea.left}, 0)"
      bind:this={yAxisGridlines} />
    <g class="y-axis" transform="translate({usableArea.left}, 0)" bind:this={yAxis} />

    <g class="dots">
      {#if xScale && rScale}
        {#each commits as item, index (item.id)}
          <circle
            cx={xScale(item.date)}
            cy={yScale(item.hourFrac)}
            r={rScale(item.totalLines)}
            fill="var(--accent-color)"
            fill-opacity="0.55"
          />
        {/each}
      {/if}
    </g>
  </svg>
</div>

<BarHorizontal data={languageData} title="Lines of Code by Language" />

<style>
  .scatter-panel {
    width: min(1100px, 100%);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 24px;
    margin: 24px auto;
    box-sizing: border-box;
  }

  .scatter-chart {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    overflow: visible;
    color: var(--text);
  }

  .chart-title {
    font-size: 1em;
    font-weight: 700;
    fill: currentColor;
  }

  /* stroke-opacity inherits to D3-generated tick lines; avoid .gridlines line (Svelte purges it). */
  .gridlines {
    stroke-opacity: 0.2;
  }

  .scatter-chart :global(.domain),
  .scatter-chart :global(.tick line) {
    stroke: var(--border);
  }

  .scatter-chart :global(.tick text) {
    fill: var(--muted);
    font-size: 12px;
  }
</style>