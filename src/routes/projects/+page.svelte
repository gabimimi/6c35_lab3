<svelte:head>
  <title>Projects</title>
</svelte:head>
<script>
  import projects from '$lib/projects.json';
  import ProjectNarrative from '$lib/ProjectNarrative.svelte';
  import Project from '$lib/Project.svelte';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  let years = projects.map(proj => proj.year);
  let range = Math.max(...years) - Math.min(...years);
  let rawData = [];
  let wrangled = [];
  let percentages = [];
  let totalLines = 0;
  onMount(async () => {
    rawData = await d3.json('/static/lab6_example.json');

    totalLines = d3.sum(rawData, d => d.lines);

    wrangled = d3.rollups(
      rawData,
      v => d3.sum(v, d => d.lines),
      d => d.language
    );

    percentages = d3.rollups(
      rawData,
      v => (d3.sum(v, d => d.lines) / totalLines) * 100,
      d => d.language
    );
  });
</script>



<h1 class="projects-title">{projects.length} Projects Across {range + 1} Years</h1>

<p class="intro">
  Scroll down to see a timeline of my projects and how they've contributed to my professional and personal life.
</p>

<ProjectNarrative />

<p class="outro">
  Thanks for scrolling through my project story! Feel free to explore all of the projects at your leisure below.
</p>

<section>
  <h2>Raw data</h2>
  <pre>{JSON.stringify(rawData, null, 2)}</pre>
</section>

<section>
  <h2>Data wrangling result</h2>
  <pre>{JSON.stringify(wrangled, null, 2)}</pre>
</section>

<section>
  <h2>Percentages</h2>
  <pre>{JSON.stringify(percentages, null, 2)}</pre>
</section>

<div class="projects">
  {#each projects as p}
    <Project data={p} />
  {/each}
</div>
