<svelte:head>
  <title>Projects</title>
</svelte:head>
<script>
  import projects from "$lib/projects.json";
</script>
<nav>
  <a href="/6c35_lab3/">Home</a>
  <a href="/6c35_lab3/projects">Projects</a>
  <a href="/6c35_lab3/contact">Contact</a>
  <a href="/6c35_lab3/resume">Resume</a>
  <a href="https://github.com/gabimimi" target="_blank" rel="noreferrer">GitHub</a>
</nav>

<h1>My Projects ({projects.length})</h1>
<div class="projects homepageContent">
    {#each projects as p}
        <article>
            <h2>{p.title}</h2>
            <img src={p.image} alt={p.title} />
            <p>{p.description}</p>
        </article>
    {/each}
</div>

