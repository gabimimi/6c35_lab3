<svelte:head>
  <title>Resume</title>
</svelte:head>
<svelte:body>
  <nav>
    <a href="../index.html">Home</a>
    <a href="../projects/index.html">Projects</a>
    <a href="../contact/index.html">Contact</a>
    <a href="index.html" class="current">Resume</a>
    <a href="https://github.com/gabimimi" target="_blank" rel="noopener noreferrer">GitHub</a>
  </nav>

  <h1>Resume</h1>

  <section class="homepageContent resumeWrap">
    <section>
      <p>Here's my resume. You can view it below or download it.</p>

      <section class="resumeButtons">
        <a class="btn" href="resume.pdf" download>Download PDF</a>
        <a class="btn ghost" href="resume.pdf" target="_blank" rel="noopener noreferrer">Open in new tab</a>
      </section>

      <iframe class="resumeFrame" src="resume.pdf" title="Gabriela Miranda's Resume"></iframe>

      <section aria-labelledby="education">
        <h2 id="education">Education</h2>
        <ul>
          <li>
            <strong>Massachusetts Institute of Technology (MIT)</strong><br>
            B.S. Computer Science & Engineering (6-3) + B.S. Economics (14-1)<br>
            <time datetime="2023">2023</time> - <time datetime="2027">2027</time>
          </li>
        </ul>
      </section>

      <section aria-labelledby="experience">
            <h2 id="experience">Experience</h2>

            <article>
                <div class="resumeTop">
                <h3>J-PAL — Research Assistant</h3>
                <span class="resumeDate"><time datetime="2025">2025</time> - Present</span>
                </div>
                <p>Building an NLP-powered database search tool so people can find the right researchers and work faster.</p>
                <ul>
                <li>Organize and clean information so it's easy to search and reliable.</li>
                <li>Write short summaries so the work is easier to use in real decisions.</li>
                </ul>
            </article>

            <article>
                <div class="resumeTop">
                <h3>MIT — Teaching Assistant (Mathematics for Computer Science)</h3>
                <span class="resumeDate"><time datetime="2025">2025</time> - Present</span>
                </div>
                <ul>
                <li>Support students with fundamentals through office hours and problem sets.</li>
                <li>Help explain core ideas clearly (without making it intimidating).</li>
                </ul>
            </article>
        </section>  

      <section aria-labelledby="skills">
        <h2 id="skills">Skills</h2>
        <ul>
          <li>Data work and analysis</li>
          <li>Writing clear, structured summaries</li>
          <li>Building practical tools</li>
          <li>Teamwork and communication</li>
        </ul>
      </section>
    </section>
  </section>
</svelte:body>

