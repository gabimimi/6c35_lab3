<svelte:head>
  <title>Contact me</title>
</svelte:head>
<svelte:body> 
  <!-- Navigation menu: -->
        <nav>
            <!-- Navigation link to the home page -->
            <a href="../index.html">Home</a>
                <!--    
                    href="../index.html" refers to the file that this link will open
                    The "../" moves up one directory (out of the current folder) before looking for index.html
=                -->
    
            <!-- Navigation link to this same page i.e. projects/index.html-->
            <a href="../projects/index.html">Projects</a>
                <!-- Please note that here we do NOT use "../" because index.html is already in the current folder.-->

            <!-- Complete the navigation as needed following the structure -->
            <a class="current" href="index.html">Contact</a>
            <a href="../resume/index.html">Resume</a>
            <a href="https://github.com/gabimimi" target="_blank" rel="noopener noreferrer">GitHub</a>
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
</svelte:body>