<svelte:head>
  <title>Contact me</title>
</svelte:head>


<nav>
  <a href="/6c35_lab3/">Home</a>
  <a href="/6c35_lab3/projects">Projects</a>
  <a href="/6c35_lab3/contact">Contact</a>
  <a href="/6c35_lab3/resume">Resume</a>
  <a href="https://github.com/gabimimi" target="_blank" rel="noreferrer">GitHub</a>
</nav>
<h1>Contact</h1>

<section class="homepageContent">
    <section>
        <p>
            Want to reach out? Send me a message here — it'll open your email app with everything filled in.
        </p>

        <form action="mailto:gmmirand@mit.edu" method="GET" enctype="text/plain" class="contactForm">
            <label>
                Your email
                <input name="email" type="email" placeholder="you@example.com" required>
            </label>

            <label>
                Subject
                <input name="subject" placeholder="What's this about?" required>
            </label>

            <label>
                Message
                <textarea name="body" rows="7" placeholder="Write your message..." required></textarea>
            </label>

            <button>Send</button>
        </form>
    </section>
</section>
