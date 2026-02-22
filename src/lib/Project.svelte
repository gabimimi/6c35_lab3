<script>
  export let data = {};
</script>

<article>
  <h2>{data.title}</h2>

  {#if data.image}
    <img src={data.image} alt={data.title} />
  {/if}

  <p>{data.description}</p>
</article>