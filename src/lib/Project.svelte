<script>
  export let data = {};
</script>

<article class="projectCard">
  <h2>{data.title}</h2>

  {#if data.image}
    <img src={data.image} alt={data.title} />
  {/if}

  <p>{data.description}</p>
</article>

<style>
  article{
    border: 1px solid rgba(17, 24, 39, 0.10);
    border-radius: 16px;
    padding: 14px 14px 12px;
    background: rgba(255,255,255,0.75);
  }

  h2{
    margin: 0 0 6px;
    font-size: 1.8rem;
    letter-spacing: -0.01em;
  }

  p{
    margin: 0;
    font-size: 1.8rem;
    line-height: 1.55;
    color: var(--muted);
  }

  img{
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: #fafafa;
    margin: 10px 0;
  }
</style>