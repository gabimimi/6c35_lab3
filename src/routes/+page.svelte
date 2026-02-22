<svelte:head>
    <title>Home</title>
</svelte:head>
<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";

  import reading from "$lib/reading.json";
  import ReadingItem from "$lib/ReadingItem.svelte";
</script>
<nav>
  <a href="/6c35_lab3/">Home</a>
  <a href="/6c35_lab3/projects">Projects</a>
  <a href="/6c35_lab3/contact">Contact</a>
  <a href="/6c35_lab3/resume">Resume</a>
  <a href="https://github.com/gabimimi" target="_blank" rel="noreferrer">GitHub</a>
</nav>



<h1>Gabriela Miranda</h1>

<div class="homeGrid">
    <section class="homepageContent">
        <p>Hi! I'm Gabriela Miranda, MIT '27, 6-3 (CS) + 14-1 (Econ), from Paraguay. Right now 
            I'm at J-PAL building an NLP-powered search tool that makes it easier to find the right 
            researchers + work without digging forever. I'm there because I care about real impact: research that 
            actually turns into better decisions for real people. I also TA Math for CS, so I spend a lot of 
            time making fundamentals feel less scary. Off-screen, I play piano and sing!🎹</p>

        <!-- <img> (Image) tag is used to display images.-->
        <img src="images/gabi.jpg" alt="a pic of myself... hopefully it loads soon!">
    </section>

    <h2>Latest Projects</h2>

    <div class="projects homepageContent">
    {#each projects.slice(0, 3) as p}
        <Project data={p} />
    {/each}
    </div>

    <h2>What I’m Reading</h2>

    <div class="reading">
    {#each reading as item}
        <ReadingItem data={item} />
    {/each}
    </div>
</div>
