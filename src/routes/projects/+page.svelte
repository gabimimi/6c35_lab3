<svelte:head>
  <title>Projects</title>
</svelte:head>
<script>
  import projects from '$lib/projects.json';
  import ProjectNarrative from '$lib/ProjectNarrative.svelte';
  import Project from '$lib/Project.svelte';
  let years = projects.map(proj => proj.year);
  let range = Math.max(...years) - Math.min(...years);
</script>



<h1 class="projects-title">{projects.length} Projects Across {range + 1} Years</h1>

<p class="intro">
  Scroll down to see a timeline of my projects and how they've contributed to my professional and personal life.
</p>

<ProjectNarrative />

<p class="outro">
  Thanks for scrolling through my project story! Feel free to explore all of the projects at your leisure below.
</p>

<div class="projects">
  {#each projects as p}
    <Project data={p} />
  {/each}
</div>

<style>
  .projects-title{
    position: sticky;
    top: 88px;
    z-index: 40;
    background: var(--bg);
    padding-top: 12px;
    padding-bottom: 12px;
  }
</style>