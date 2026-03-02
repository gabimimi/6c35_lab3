<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  let pages = [
    { url: "/", title: "About" },
    { url: "/projects", title: "Projects" },
    { url: "/resume", title: "Resume" },
    { url: "/contact", title: "Contact" },
    { url: "https://github.com/gabimimi", title: "Github" },
  ];
</script>

<nav>
  {#each pages as p}
    <a
      href={p.url.startsWith("http") ? p.url : base + p.url}
      target={p.url.startsWith("http") ? "_blank" : null}
      rel={p.url.startsWith("http") ? "noopener noreferrer" : null}
      class:current={
        p.url.startsWith("http")
          ? false
          : p.url === "/"
            ? $page.url.pathname === (base + "/")
            : $page.url.pathname.startsWith(base + p.url)
      }
    >
      {p.title}
    </a>
  {/each}
</nav>

<slot />

<style>
    /* Nav */
    nav{
        width: 100%;
        margin: 0 auto;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0px;
        z-index: 1000;
        border-bottom: 1px solid oklch(80% 3% 200);
        padding-bottom: 6px;
        background:
            radial-gradient(900px 500px at 15% 15%, rgba(109,94,252,0.10), transparent 60%),
            radial-gradient(900px 500px at 85% 20%, rgba(255,111,174,0.10), transparent 55%),
            var(--bg);
    }

    nav a{
        text-decoration: none;
        color:inherit;
        text-align: center;
        font-weight: 600;
        padding: 0.5em;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: rgba(255,255,255,0.85);
        transition: transform 140ms ease, box-shadow 140ms ease;
        font-size: 1.5rem;
    }

    nav a:hover{
        transform: translateY(-2px);
        box-shadow: 0 10px 22px rgba(17, 24, 39, 0.10);
    }

    nav a.current{
        border-bottom: 0.4em solid oklch(80% 3% 200);
        padding-bottom: 0.1em;
    }

</style>