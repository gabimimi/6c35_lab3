<svelte:head>
    <title>Home</title>
</svelte:head>
<script>
  import { base } from "$app/paths";
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
        <img src="{base}/images/gabi.jpg" alt="a pic of myself... hopefully it loads soon!">
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
<div class="githubStatsWrap">
  {#if loading}
    <p class="githubMessage">Loading...</p>
  {:else if error}
    <p class="githubMessage githubError">Something went wrong: {error.message}</p>
  {:else}
    <section class="githubStatsCard">
      <h2>My GitHub Stats</h2>
      <dl class="githubStatsList">
        <div class="statItem">
          <dt>Followers</dt>
          <dd>{githubData.followers}</dd>
        </div>

        <div class="statItem">
          <dt>Following</dt>
          <dd>{githubData.following}</dd>
        </div>

        <div class="statItem">
          <dt>Public Repositories</dt>
          <dd>{githubData.public_repos}</dd>
        </div>
      </dl>
    </section>
  {/if}
</div>

<h2>Latest Projects</h2>
<div class="projects highlights">
  {#each projects.slice(-3).reverse() as p}
    <Project data={p} />
  {/each}
</div>