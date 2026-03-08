<script>
  import projects from '$lib/projects.json';
</script>

<section class="projectNarrative">
  {#each projects as project}
    <article class="narrativeCard">
      <div class="narrativeText">
        <p class="year">{project.year}</p>
        <h2>{project.title}</h2>
        <p>{project.story}</p>
      </div>

      <div class="narrativeVisual">
        <img src={project.image} alt={project.title} />
      </div>
    </article>
  {/each}
</section>

<style>
  .projectNarrative{
    width: min(1200px, 100%);
    margin: 28px auto 40px;
    display: grid;
    gap: 22px;
  }

  .narrativeCard{
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 20px;
    align-items: center;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 24px;
  }

  .narrativeText h2{
    margin: 0 0 10px;
    font-size: 1.5rem;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .narrativeText p{
    margin: 0;
    color: var(--muted);
    font-size: 1.08rem;
    line-height: 1.7;
  }

  .year{
    margin-bottom: 8px !important;
    font-size: 0.95rem !important;
    font-weight: 700;
    color: var(--accent-color) !important;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .narrativeVisual img{
    width: 100%;
    height: auto;
    display: block;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: var(--surface2);
    box-shadow: var(--img-shadow);
  }

  @media (max-width: 900px){
    .narrativeCard{
      grid-template-columns: 1fr;
    }
  }
</style>