<svelte:head>
    <title>Home</title>
</svelte:head>
<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
  import { onMount } from "svelte";
  import reading from "$lib/reading.json";
  import ReadingItem from "$lib/ReadingItem.svelte";

  let githubData = null; // This will eventually hold our Github stats
  let loading = true; // This will be true *until* the fetch's promise resolves to a value
  let error = null; // If the API call resulted in an error, it will go into this variable
  let data = fetch("https://api.github.com/users/gabimimi");


  onMount(async () => {
    try {
      console.log("Page has been mounted!");
      let response = await fetch("https://api.github.com/users/gabimimi");
      console.log(response);
      githubData = await response.json();
      console.log(githubData);
    } catch (err) {
      error = err;
    }
    loading = false;
  });


</script>




<h1>Gabriela Miranda</h1>

<div class="homeRow">
  <section class="homepageContent">
        <p>Hi! I'm Gabriela Miranda, MIT '27, 6-3 (CS) + 14-1 (Econ), from Paraguay. Right now 
            I'm at J-PAL building an NLP-powered search tool that makes it easier to find the right 
            researchers + work without digging forever. I'm there because I care about real impact: research that 
            actually turns into better decisions for real people. I also TA Math for CS, so I spend a lot of 
            time making fundamentals feel less scary. Off-screen, I play piano and sing!🎹</p>

        <!-- <img> (Image) tag is used to display images.-->
        <img src="images/gabi.jpg" alt="a pic of myself... hopefully it loads soon!">
    </section>

  <section class="readingPanel">
    <h2>What I’m Reading</h2>
    <div class="reading">
      {#each reading as item}
        <ReadingItem data={item} />
      {/each}
    </div>
  </section>
</div>
{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>Something went wrong: {error.message}</p>
{:else}
    The data is {JSON.stringify(githubData)}
{/if}

<h2>Latest Projects</h2>
<div class="projects highlights">
  {#each projects.slice(0, 3) as p}
    <Project data={p} />
  {/each}
</div>