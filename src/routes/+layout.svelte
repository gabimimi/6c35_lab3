<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  let pages = [
    { url: "/", title: "About" },
    { url: "/projects", title: "Projects" },
    { url: "/resume", title: "Resume" },
    { url: "/contact", title: "Contact" },
    { url: "https://github.com/gabimimi", title: "Github", external: true },
  ];

  // normalize pathname so "/projects/" and "/projects" behave the same
  const norm = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
</script>

<nav>
  {#each pages as p}
    {#if p.external}
      <a href={p.url} target="_blank" rel="noopener noreferrer">{p.title}</a>
    {:else}
      <a
        href={base + p.url}
        class:current={norm($page.url.pathname) === norm(base + p.url)}
      >
        {p.title}
      </a>
    {/if}
  {/each}
</nav>

<slot />