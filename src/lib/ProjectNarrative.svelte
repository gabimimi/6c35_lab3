<script>
  import Scrolly from "svelte-scrolly";
  import projects from "$lib/projects.json";

  let scrollyProgress = 0;
</script>

<div class="narrativeWrap">
  <Scrolly bind:progress={scrollyProgress}>
    <div class="storyColumn">
      {#each projects as project}
        <article class="storyStep">
          <p class="year">{project.year}</p>
          <h2>{project.title}</h2>
          <p>{project.story}</p>
        </article>
      {/each}
    </div>

    <svelte:fragment slot="viz">
      <div class="vizColumn">
        <img src={projects[0].image} alt={projects[0].title} />
      </div>
    </svelte:fragment>
  </Scrolly>
</div>

<style>
  .narrativeWrap{
    width: min(1200px, 100%);
    margin: 28px auto 40px;
  }

  .storyColumn{
    display: grid;
    gap: 36px;
  }

  .storyStep{
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 24px;
    background: var(--article-bg);
    border: 1px solid var(--article-border);
    border-radius: 22px;
    box-shadow: var(--shadow);
  }

  .year{
    margin: 0 0 10px;
    color: var(--accent-color);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.92rem;
  }

  h2{
    margin: 0 0 12px;
    font-size: clamp(1.6rem, 2.5vw, 2.2rem);
    line-height: 1.08;
    letter-spacing: -0.04em;
    color: var(--text);
  }

  .storyStep p:last-child{
    margin: 0;
    color: var(--muted);
    font-size: 1.08rem;
    line-height: 1.75;
  }

  .vizColumn{
    width: min(520px, 100%);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 18px;
  }

  .vizColumn img{
    width: 100%;
    display: block;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: var(--surface2);
    box-shadow: var(--img-shadow);
  }
</style>