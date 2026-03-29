<svelte:head>
  <title>Contact me</title>
</svelte:head>



<script>
  function handleContactSubmit(/** @type {SubmitEvent} */ e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;
    const fd = new FormData(form);
    const from = String(fd.get('email') ?? '');
    const subject = encodeURIComponent(String(fd.get('subject') ?? ''));
    const body = encodeURIComponent(
      `From: ${from}\n\n${String(fd.get('body') ?? '')}`
    );
    window.location.href = `mailto:gmmirand@mit.edu?subject=${subject}&body=${body}`;
  }
</script>

<h1>Contact</h1>

<section class="homepageContent">
    <section>
        <p>
            Want to reach out? Send me a message here — it'll open your email app with everything filled in.
        </p>

        <form on:submit={handleContactSubmit} class="contactForm">
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
