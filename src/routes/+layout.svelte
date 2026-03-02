<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import "../style.css";

  let pages = [
    { url: "/", title: "About" },
    { url: "/projects", title: "Projects" },
    { url: "/resume", title: "Resume" },
    { url: "/contact", title: "Contact" },
    { url: "https://github.com/gabimimi", title: "Github" },
  ];

  let theme = "auto";

  $: if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.dataset.theme = theme;

    // keep browser controls consistent too
    root.style.setProperty(
      "color-scheme",
      theme === "auto" ? "light dark" : theme
    );
  }
</script>
<label class="color-scheme-switch">
  Theme:
  <select bind:value={theme}>
    <option value="auto">Automatic</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</label>


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

        border-bottom: 2px solid var(--nav-border-color);
        padding-bottom: 6px;

        background:
            radial-gradient(900px 500px at 15% 15%, var(--g1), transparent 60%),
            radial-gradient(900px 500px at 85% 20%, var(--g2), transparent 55%),
            var(--bg);
    }

    nav a{
        text-decoration: none;
        color: inherit;
        text-align: center;
        font-weight: 600;
        padding: 0.5em;
        border-radius: 999px;
        border: 1px solid var(--border);

        /* was hardcoded white -> now adapts */
        background: var(--nav-link-bg);

        transition: transform 140ms ease, box-shadow 140ms ease;
        font-size: 1.5rem;
    }

    nav a:hover{
        transform: translateY(-2px);
        box-shadow: var(--nav-hover-shadow);
    }

    nav a.current{
        border-bottom: 4px solid var(--nav-border-color);
        padding-bottom: 0.1em;
    }

    .color-scheme-switch{
        position: fixed;
        top: 14px;
        right: 14px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: var(--card);
        box-shadow: var(--shadow);
        font-weight: 700;
        color: var(--text);
        z-index: 2000;
    }

    .color-scheme-switch select{
        font: inherit;
        color: var(--text);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 6px 10px;
    }


</style>