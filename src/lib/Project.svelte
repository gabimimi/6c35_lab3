<script>
  import { base } from '$app/paths';

  export let data = {};

  $: imageSrc =
    data.image &&
    (String(data.image).startsWith('http://') || String(data.image).startsWith('https://'))
      ? data.image
      : data.image
        ? `${base}/${String(data.image).replace(/^\//, '')}`
        : '';
</script>

<article class="projectCard">
  <h2>{data.title}</h2>

  {#if data.image}
    <img src={imageSrc} alt={data.title} />
  {/if}
  <p>{data.year}</p>
  <p>{data.description}</p>
</article>

<style>
  article{
  border: 1px solid var(--article-border);
  border-radius: 16px;
  padding: 14px 14px 12px;
  background: var(--article-bg);
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
  background: var(--img-bg);
  margin: 10px 0;
}
</style>