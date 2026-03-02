<script>
  import { base } from "$app/paths";

  let pages = [
    { url: "/", title: "About" },
    { url: "/projects", title: "Projects" },
    { url: "/resume", title: "Resume" },
    { url: "/contact", title: "Contact" },
    { url: "https://github.com/gabimimi", title: "Github", external: true },
  ];
</script>

<nav>
  {#each pages as p}
    <a
      href={p.external ? p.url : base + p.url}
      class={p.title === "About" ? "current" : ""}
      target={p.external ? "_blank" : undefined}
      rel={p.external ? "noopener noreferrer" : undefined}
    >
      {p.title}
    </a>
  {/each}
</nav>

<slot />