<svelte:head>
  <title>Projects</title>
</svelte:head>
<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
</script>



<h1>Projects ({projects.length})</h1>

<div class="projects homepageContent">
  {#each projects.slice(0, 10) as p}
    <Project data={p} />
  {/each}
</div>

