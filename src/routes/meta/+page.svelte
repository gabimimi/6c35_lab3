<script>
  import { computePosition, autoPlacement, offset } from '@floating-ui/dom';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import BarHorizontal from '$lib/BarHorizontal.svelte';
  import LineChart from '$lib/LineChart.svelte';

  let width = 700;
  let height = 300;

  let margin = { top: 45, right: 40, bottom: 55, left: 90 };

  /** Same horizontal margins as scatter so bar inner width matches the dot plot. */
  let barChartHeight = 220;
  $: barMargin = {
    top: 34,
    right: margin.right,
    bottom: 52,
    left: margin.left
  };

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

  /** @type {SVGSVGElement | undefined} Root scatter SVG (d3-brush). */
  let svg;

  let xAxis;
  let yAxis;
  let yAxisGridlines;

  let locData = [];
  let commits = [];

  /** One row per calendar day: total line edits that day (for the line chart). */
  let linesByDate = [];

  $: {
    if (locData.length === 0) {
      linesByDate = [];
    } else {
      const rolled = d3
        .rollups(locData, v => v.length, d => d3.timeDay.floor(d.datetime))
        .map(([date, count]) => ({ date, count }));

      const [minDate, maxDate] = d3.extent(rolled, d => d.date);
      const allDays =
        minDate instanceof Date &&
        maxDate instanceof Date &&
        !Number.isNaN(minDate.valueOf()) &&
        !Number.isNaN(maxDate.valueOf())
          ? d3.timeDays(minDate, d3.timeDay.offset(maxDate, 1))
          : [];

      linesByDate = allDays.map(date => ({
        date,
        count: rolled.find(d => d.date.getTime() === date.getTime())?.count ?? 0
      }));
    }
  }

  let hoveredIndex = -1;
  /** Last commit shown in the tooltip; kept during fade-out so content doesn’t flash to “—”. */
  let tooltipCommit = null;
  /** @type {HTMLDListElement | null} */
  let commitTooltip = null;
  let tooltipPosition = { x: 0, y: 0 };

  /** Commits toggled on by click (same object references as `commits`). */
  let clickedCommits = [];

  /** @type {[[number, number], [number, number]] | null} */
  let brushSelection = null;

  /** @param {{ selection: [[number, number], [number, number]] | null }} evt */
  function brushed(evt) {
    brushSelection = evt.selection;
  }

  /** @param {number} index */
  function toggleClickedCommit(index) {
    const commit = commits[index];
    if (!commit) return;
    if (!clickedCommits.includes(commit)) {
      clickedCommits = [...clickedCommits, commit];
    } else {
      clickedCommits = clickedCommits.filter(c => c !== commit);
    }
  }

  /**
   * @param {number} index
   * @param {MouseEvent} evt
   */
  async function dotInteraction(index, evt) {
    if (evt.type === 'mouseleave') {
      hoveredIndex = -1;
      return;
    }
    if (evt.type === 'click') {
      toggleClickedCommit(index);
      return;
    }
    if (evt.type === 'mouseenter') {
      hoveredIndex = index;
      if (index >= 0 && index < commits.length) {
        tooltipCommit = commits[index];
      }
      const hoveredDot = evt.currentTarget;
      if (!(hoveredDot instanceof Element) || !commitTooltip) return;
      try {
        const pos = await computePosition(hoveredDot, commitTooltip, {
          strategy: 'fixed',
          middleware: [offset(5), autoPlacement()]
        });
        if (hoveredIndex === index) {
          tooltipPosition = { x: pos.x, y: pos.y };
        }
      } catch {
        /* ignore layout errors (e.g. unmounted) */
      }
    }
  }

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

    commits = d3.sort(commits, d => -d.totalLines);
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

  /** @param {typeof commits[0]} commit */
  function isCommitBrushed(commit) {
    if (!brushSelection || !xScale || !yScale) return false;
    const [[x0, y0], [x1, y1]] = brushSelection;
    const [xmin, xmax] = d3.extent([x0, x1]);
    const [ymin, ymax] = d3.extent([y0, y1]);
    const cx = xScale(commit.date);
    const cy = yScale(commit.hourFrac);
    return cx >= xmin && cx <= xmax && cy >= ymin && cy <= ymax;
  }

  $: brushedCommits = brushSelection ? commits.filter(isCommitBrushed) : [];

  $: selectedCommits = Array.from(new Set([...clickedCommits, ...brushedCommits]));

  $: [minTotalLines, maxTotalLines] =
    commits.length > 0 ? d3.extent(commits.map(d => d.totalLines)) : [undefined, undefined];
  $: rScale =
    commits.length > 0 &&
    minTotalLines != null &&
    maxTotalLines != null &&
    Number.isFinite(minTotalLines) &&
    Number.isFinite(maxTotalLines)
      ? d3
          .scaleSqrt()
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

  $: {
    if (svg) {
      d3.select(svg).selectAll('g.brush').remove();
      d3.select(svg).call(
        d3
          .brush()
          .extent([
            [usableArea.left, usableArea.top],
            [usableArea.right, usableArea.bottom]
          ])
          .on('start brush end', brushed)
      );
      d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
    }
  }

  /** All languages in the repo; bar order/value updates from selection without dropping categories. */
  $: barData =
    locData.length === 0
      ? []
      : (() => {
          const selectedLines =
            selectedCommits.length > 0
              ? selectedCommits.flatMap(c => c.lines)
              : locData;
          const countByType = d3.rollup(selectedLines, v => v.length, d => d.type);
          const allLanguages = Array.from(new Set(locData.map(d => d.type)));
          return d3.sort(
            allLanguages.map(lang => ({
              label: String(lang),
              value: countByType.get(lang) ?? 0
            })),
            (a, b) => b.value - a.value
          );
        })();

  $: barChartTitle =
    selectedCommits.length === 0
      ? 'Website language breakdown'
      : `Lines of Code: ${selectedCommits.length} Selected Commits`;
</script>

<svelte:head>
  <title>Meta</title>
</svelte:head>

<h1>Meta</h1>

<div class="meta-dashboard">
  <div class="meta-scatter-wrap">
  <svg
    bind:this={svg}
    class="scatter-chart"
    viewBox="0 0 {width} {height}"
    preserveAspectRatio="xMidYMid meet">
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
            role="button"
            tabindex="0"
            aria-pressed={selectedCommits.includes(item)}
            aria-label={`Commit ${item.id}, ${item.totalLines} lines; toggle selection`}
            class:selected={selectedCommits.includes(item)}
            cx={xScale(item.date)}
            cy={yScale(item.hourFrac)}
            r={rScale(item.totalLines)}
            fill="var(--accent-color)"
            fill-opacity="0.55"
            on:mouseenter={(e) => dotInteraction(index, e)}
            on:mouseleave={(e) => dotInteraction(index, e)}
            on:click={(e) => dotInteraction(index, e)}
            on:keydown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              toggleClickedCommit(index);
            }}
          />
        {/each}
      {/if}
    </g>
  </svg>

  <dl
    class="info tooltip"
    bind:this={commitTooltip}
    hidden={hoveredIndex === -1}
    style:--tooltip-x="{tooltipPosition.x}px"
    style:--tooltip-y="{tooltipPosition.y}px">
    <dt>Commit</dt>
    <dd>
      {#if tooltipCommit?.url}
        <a href={tooltipCommit.url} target="_blank" rel="noopener noreferrer">{tooltipCommit.id}</a>
      {:else}
        <span class="tooltip-empty">—</span>
      {/if}
    </dd>

    <dt>Date</dt>
    <dd>
      {tooltipCommit?.datetime?.toLocaleString('en', { dateStyle: 'full' }) ?? '—'}
    </dd>

    <dt>Time</dt>
    <dd>
      {#if tooltipCommit}
        {tooltipCommit.time} <span class="tz">({tooltipCommit.timezone})</span>
      {:else}
        <span class="tooltip-empty">—</span>
      {/if}
    </dd>

    <dt>Author</dt>
    <dd>{tooltipCommit?.author ?? '—'}</dd>

    <dt>Lines edited</dt>
    <dd>{tooltipCommit?.totalLines ?? '—'}</dd>
  </dl>
  </div>

  <div class="meta-bar-wrap">
    <BarHorizontal
      embedded
      width={width}
      height={barChartHeight}
      margin={barMargin}
      data={barData}
      title={barChartTitle}
    />
  </div>
</div>

<LineChart data={linesByDate} />

<style>
  .meta-dashboard {
    width: min(1100px, 100%);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 24px;
    margin: 24px auto;
    box-sizing: border-box;
  }

  .meta-scatter-wrap {
    position: relative;
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
    font-size: 0.88rem;
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

  .scatter-chart .dots :global(circle) {
    transition: fill 200ms, fill-opacity 200ms;
    cursor: pointer;
    outline: none;
  }

  .scatter-chart .dots :global(circle:focus-visible) {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }

  .scatter-chart .dots :global(circle.selected) {
    fill: var(--accent-pink);
  }

  .scatter-chart .dots :global(circle:hover) {
    fill: color-mix(in srgb, var(--accent-color) 55%, var(--text));
    fill-opacity: 0.92;
  }

  dl.info {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 6px 14px;
    margin: 0;
    transition-duration: 500ms;
    transition-property: opacity, visibility;
  }

  /*
    Keep tooltip in DOM for exit transitions. Native [hidden] uses display:none and blocks transitions,
    so we force layout and fade with opacity/visibility. When [hidden] but user hovers/focuses the dl
    (e.g. to click the commit link), keep it visible.
  */
  dl.info.tooltip[hidden] {
    display: grid !important;
  }

  dl.info.tooltip[hidden]:not(:hover):not(:focus-within) {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  dl.info.tooltip[hidden]:hover,
  dl.info.tooltip[hidden]:focus-within {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  dl.info.tooltip:not([hidden]) {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  dl.info .tooltip-empty {
    color: var(--muted);
    font-weight: 500;
  }

  dl.info dt {
    margin: 0;
    font-weight: 600;
    font-size: 0.82rem;
    color: var(--muted);
  }

  dl.info dd {
    margin: 0;
    font-size: 0.95rem;
    color: var(--text);
    font-weight: 600;
  }

  dl.info dd a {
    color: var(--accent-color);
    font-weight: 700;
  }

  dl.info dd a:hover {
    text-decoration: underline;
  }

  dl.info .tz {
    font-weight: 500;
    color: var(--muted);
    font-size: 0.88em;
  }

  .tooltip {
    position: fixed;
    top: var(--tooltip-y, 0px);
    left: var(--tooltip-x, 0px);
    z-index: 4000;
    max-width: min(340px, calc(100vw - 24px));
    padding: 14px 18px;
    background: var(--panel-bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    box-shadow: var(--shadow);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
</style>