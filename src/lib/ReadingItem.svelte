<script>
  import { base } from '$app/paths';

  export let data = {};
</script>

<article class="readingItem">
  {#if data.image}
    <img class="cover" src="{base}/{data.image}" alt={data.title} />
  {/if}

  <div class="meta">
    <h3 class="title">
      {#if data.link}
        <a href={data.link} target="_blank" rel="noreferrer">{data.title}</a>
      {:else}
        {data.title}
      {/if}
    </h3>

    <p class="author">{data.author}</p>

    {#if data.description}
      <p class="desc">{data.description}</p>
    {/if}
  </div>
</article>

<style>
  .readingItem{
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--panel-bg);
}

.cover{
  width: 88px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--cover-bg);
  flex: 0 0 auto;
}

.title{
  margin: 0 0 6px;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.2;
}

.author{
  margin: 0;
  color: var(--muted);
  font-weight: 600;
}

.desc{
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.5;
}
</style>