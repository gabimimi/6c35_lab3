<svelte:head>
  <title>Projects</title>
</svelte:head>
<script>
  import projects from "$lib/projects.json";
</script>
<nav>
  <a href="/6c35_lab3/">Home</a>
  <a href="/6c35_lab3/projects">Projects</a>
  <a href="/6c35_lab3/contact">Contact</a>
  <a href="/6c35_lab3/resume">Resume</a>
  <a href="https://github.com/gabimimi" target="_blank" rel="noreferrer">GitHub</a>
</nav>

<h1>My Projects</h1>
<pre>{JSON.stringify(projects, null, "\t")}</pre>
<div class="projects homepageContent">
    {#each projects as p}
        <article>
            <h2>{p.title}</h2>
            <img src={p.image} alt={p.title} />
            <p>{p.description}</p>
        </article>
    {/each}
</div>
<section class="homepageContent">
    <section>
        <p>
            A few things I've built and written that I'm proud of — mostly focused on making information
            easier to use, and experiences more intuitive.
        </p>

        <section class="projectsGrid">
            <section class="projectCard">
                <h2>Messaging App for Planning + Groups</h2>
                <p>
                    A chat-style app built around real needs: making it easier for groups to plan events,
                    coordinate, and keep conversations organized without chaos.
                </p>
            </section>

            <section class="projectCard">
                <h2>Online Board Game</h2>
                <p>
                    A web-based board game designed to feel smooth and fair, even when multiple people are
                    playing at the same time. I cared a lot about clarity and making it easy to use.
                </p>
            </section>

            <section class="projectCard">
                <h2>Satellite Communication Write-Up</h2>
                <p>
                    A proposal that lays out how satellites could reliably talk to each other. I focused on
                    tricky situations (when things go wrong) and the tradeoffs between speed, reliability,
                    and simplicity.
                </p>
            </section>

            <section class="projectCard">
                <h2>NLP-Powered Research Finder</h2>
                <p>
                    A project at J-PAL to help people find the right researchers and topics faster using
                    plain-language search — so evidence is easier to discover and easier to use.
                </p>
            </section>
        </section>
    </section>
</section>

