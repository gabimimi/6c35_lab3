<script>
  import Scrolly from "svelte-scrolly";
  import projects from "$lib/projects.json";

  let scrollyProgress = 0;
  let sorted_projects = [...projects].sort((a, b) => a.year - b.year);

  let progressPerProject = 100 / sorted_projects.length;

  $: activeProjectIdx = Math.min(
    sorted_projects.length - 1,
    Math.floor(scrollyProgress / progressPerProject)
  );
</script>

<section class="projectNarrative">
  <Scrolly bind:progress={scrollyProgress}>
    <div class="storyColumn">
      {#each sorted_projects as project}
        <section class="storyStep">
          <div class="storyCard">
            <h3>{project.title}</h3>
            <p>{project.story}</p>
          </div>
        </section>
      {/each}
    </div>

    <svelte:fragment slot="viz">
      <div class="vizPanel">
        <p>{activeProjectIdx}</p>
      </div>
    </svelte:fragment>
  </Scrolly>
</section>

<style>
  .projectNarrative{
    width: min(1200px, 100%);
    margin: 28px auto 40px;
  }

  .storyColumn{
    display: grid;
    gap: 24px;
  }

  .storyStep{
    min-height: 70vh;
    display: flex;
    align-items: center;
  }

  .storyCard{
    width: 100%;
    background: var(--article-bg);
    border: 1px solid var(--article-border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 24px;
  }

  .storyCard h3{
    margin: 0 0 12px;
    font-size: clamp(1.4rem, 2.2vw, 2rem);
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .storyCard p{
    margin: 0;
    color: var(--muted);
    font-size: 1.08rem;
    line-height: 1.75;
  }

  .vizPanel{
    width: min(420px, 100%);
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 24px;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    color: var(--accent-color);
  }
</style>