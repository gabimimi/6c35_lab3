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
        <section class="step">
          <div class="step-content">
            <h3>{project.title}</h3>
            <p>{project.story}</p>
          </div>
        </section>
      {/each}
    </div>

    <svelte:fragment slot="viz">
      <div class="project-detail">
        <h3>{sorted_projects[activeProjectIdx].year}</h3>
        <img
          src={sorted_projects[activeProjectIdx].image}
          alt={sorted_projects[activeProjectIdx].title}
        />
      </div>
    </svelte:fragment>
  </Scrolly>
</section>

<style>
  .projectNarrative {
    width: 100%;
    margin: 28px auto 40px;
  }

  .storyColumn {
    display: grid;
    gap: 24px;
  }

  .step {
    min-height: 80vh;
    padding: 2rem;
    display: flex;
    align-items: center;
  }

  .step-content {
    width: 100%;
    padding: 1.5rem 2rem;
    border-left: 4px solid var(--accent-color);
    background: var(--article-bg);
    border: 1px solid var(--article-border);
    border-left: 4px solid var(--accent-color);
    border-radius: 0 22px 22px 0;
    box-shadow: var(--shadow);
  }

  .step-content h3 {
    margin: 0 0 12px;
    font-size: clamp(1.4rem, 2.2vw, 2rem);
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .step-content p {
    margin: 0;
    color: var(--muted);
    font-size: 1.08rem;
    line-height: 1.75;
  }

  .project-detail {
    width: min(520px, 100%);
    padding: 2rem;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);

    position: relative;
    left: 50%;
    transform: translateX(-35%);
  }

  .project-detail h3 {
    margin: 0 0 14px;
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--accent-color);
    letter-spacing: -0.02em;
    text-align: center;
  }

  .project-detail img {
    width: 100%;
    display: block;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: var(--surface2);
    box-shadow: var(--img-shadow);
  }

  @media (max-width: 1100px) {
    .project-detail {
      left: 0;
      transform: none;
      margin: 0 auto;
    }
  }
</style>