<svelte:head>
    <title>Home</title>
</svelte:head>
<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";

  import reading from "$lib/reading.json";
  import ReadingItem from "$lib/ReadingItem.svelte";
</script>
<nav>
  <a href="/6c35_lab3/">Home</a>
  <a href="/6c35_lab3/projects">Projects</a>
  <a href="/6c35_lab3/contact">Contact</a>
  <a href="/6c35_lab3/resume">Resume</a>
  <a href="https://github.com/gabimimi" target="_blank" rel="noreferrer">GitHub</a>
</nav>



<h1>Gabriela Miranda</h1>

<div class="homeRow">
  <div class="homepageContent">
    <!-- your existing bio text + image goes here -->
  </div>

  <section class="readingPanel">
    <h2>What I’m Reading</h2>
    <div class="reading">
      {#each reading as item}
        <ReadingItem data={item} />
      {/each}
    </div>
  </section>
</div>

<h2>Latest Projects</h2>
<div class="projects highlights">
  {#each projects.slice(0, 3) as p}
    <Project data={p} />
  {/each}
</div>