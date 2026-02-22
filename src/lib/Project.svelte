<script>
  export let data = {};
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
</script>

<article>
  <h2>{data.title}</h2>

  {#if data.image}
    <img src={data.image} alt={data.title} />
  {/if}

  <p>{data.description}</p>

  <h2>Latest Projects</h2>

    <div class="projects homepageContent">
        {#each projects.slice(0, 3) as p}
            <Project data={p} />
        {/each}
    </div>
</article>