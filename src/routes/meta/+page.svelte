<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import BarHorizontal from '$lib/BarHorizontal.svelte';

  let locData = [];
  let loadError = '';

  onMount(async () => {
    try {
      locData = await d3.csv(`${base}/loc.csv`, row => ({
        ...row,
        line: Number(row.line),
        length: Number(row.length),
        depth: Number(row.depth)
      }));

      console.log('Loaded locData:', locData);
    } catch (err) {
      console.error('Failed to load loc.csv:', err);
      loadError = 'Failed to load loc.csv';
    }
  });

  $: languageData = d3.rollups(
    locData.filter(d => d.type),
    v => v.length,
    d => d.type
  )
    .map(([language, count]) => ({
      label: String(language),
      value: count
    }))
    .sort((a, b) => b.value - a.value);
</script>

<svelte:head>
  <title>Meta</title>
</svelte:head>

<h1>Meta</h1>

<p class="intro">
  This page shows a breakdown of my codebase by programming language, based on the lines of code in my project files.
</p>

{#if loadError}
  <p class="error">{loadError}</p>
{:else if locData.length === 0}
  <p class="loading">Loading code statistics...</p>
{:else}
  <BarHorizontal data={languageData} title="Lines of Code by Language" />

  <section class="debug">
    <h2>Wrangled language data</h2>
    <pre>{JSON.stringify(languageData, null, 2)}</pre>
  </section>
{/if}

<style>
  h1 {
    width: min(980px, 100%);
    margin: 0 auto 18px;
    font-size: clamp(2.4rem, 4.2vw, 3.3rem);
    letter-spacing: -0.05em;
    line-height: 1.05;
    font-weight: 800;
    position: relative;
    padding-bottom: 12px;
    text-align: center;
    margin-top: 30px;
    color: var(--text);
  }

  h1::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 120px;
    height: 6px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent-color), #ff6fae);
    left: 50%;
    transform: translateX(-50%);
  }

  .intro,
  .loading,
  .error {
    width: min(980px, 100%);
    margin: 0 auto 20px;
    text-align: center;
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.6;
  }

  .error {
    color: #b42318;
    font-weight: 600;
  }

  .debug {
    width: min(980px, 100%);
    margin: 0 auto 24px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 24px;
  }

  .debug h2 {
    margin-top: 0;
    color: var(--text);
  }

  .debug pre {
    margin: 0;
    color: var(--muted);
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>