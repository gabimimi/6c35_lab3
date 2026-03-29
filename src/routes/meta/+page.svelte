<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import BarHorizontal from '$lib/BarHorizontal.svelte';

  let width = 1000;
  let height = 600;

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
      ? d3.scaleTime().domain([minDate, maxDatePlusOne]).range([0, width]).nice()
      : null;

  $: yScale = d3.scaleLinear().domain([24, 0]).range([height, 0]);

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

<h3>Commits by time of day</h3>

<svg viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet">
  <g class="dots">
    {#if xScale}
      {#each commits as item, index (item.id)}
        <circle
          cx={xScale(item.datetime)}
          cy={yScale(item.hourFrac)}
          r="5"
          fill="steelblue"
        />
      {/each}
    {/if}
  </g>
</svg>

<BarHorizontal data={languageData} title="Lines of Code by Language" />

<style>
  svg {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    overflow: visible;
  }
</style>