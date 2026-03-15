<svelte:head>
  <title>Projects</title>
</svelte:head>

<script>
  import projects from '$lib/projects.json';
  import ProjectNarrative from '$lib/ProjectNarrative.svelte';
  import Project from '$lib/Project.svelte';
  import Bar from '$lib/Bar.svelte';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let years = projects.map(proj => proj.year);
  let range = Math.max(...years) - Math.min(...years);

  let rawData = [];
  let wrangled = [];
  let percentages = [];
  let totalLines = 0;

  $: barData = d3.rollups(projects, v => v.length, d => d.year)
    .map(([year, count]) => ({ label: String(year), value: count }));

  onMount(async () => {
    rawData = await d3.json('/lab6_example.json');

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

<Bar data={barData} />

<div class="projects">
  {#each projects as p}
    <Project data={p} />
  {/each}
</div>

