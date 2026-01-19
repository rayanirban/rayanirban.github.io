<p class="subtitle" style="margin-bottom: 2rem; color: #a1a0a0ff; font-size: 1.0rem;">Some highlights of my journey 😇</p>

<div class="showcase-grid">

<div class="showcase-item linkedin-embed">
  <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:activity:7417062191268462592" height="600" width="100%" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
</div>

<!-- Twitter/X Embeds - First 8 (2 rows) load immediately -->
<div class="showcase-item twitter-embed" data-priority="immediate">
  <blockquote class="twitter-tweet" data-theme="dark">
    <p lang="en" dir="ltr">Loading tweet...</p>
    <a href="https://twitter.com/anirbanray_/status/1691389839369732096">View Tweet</a>
  </blockquote>
</div>

<div class="showcase-item twitter-embed" data-priority="immediate">
  <blockquote class="twitter-tweet" data-theme="dark">
    <p lang="en" dir="ltr">Loading tweet...</p>
    <a href="https://twitter.com/anirbanray_/status/1691589088149664052">View Tweet</a>
  </blockquote>
</div>

<div class="showcase-item twitter-embed" data-priority="immediate">
  <blockquote class="twitter-tweet" data-theme="dark">
    <p lang="en" dir="ltr">Loading tweet...</p>
    <a href="https://twitter.com/anirbanray_/status/1694519329159602662">View Tweet</a>
  </blockquote>
</div>

<div class="showcase-item twitter-embed" data-priority="immediate">
  <blockquote class="twitter-tweet" data-theme="dark">
    <p lang="en" dir="ltr">Loading tweet...</p>
    <a href="https://twitter.com/anirbanray_/status/1699133086640853137">View Tweet</a>
  </blockquote>
</div>

<div class="showcase-item twitter-embed" data-priority="immediate">
  <blockquote class="twitter-tweet" data-theme="dark">
    <p lang="en" dir="ltr">Loading tweet...</p>
    <a href="https://twitter.com/anirbanray_/status/1699801627522396338">View Tweet</a>
  </blockquote>
</div>

<div class="showcase-item twitter-embed" data-priority="immediate">
  <blockquote class="twitter-tweet" data-theme="dark">
    <p lang="en" dir="ltr">Loading tweet...</p>
    <a href="https://twitter.com/anirbanray_/status/1692016056695402625">View Tweet</a>
  </blockquote>
</div>

<div class="showcase-item twitter-embed" data-priority="immediate">
  <blockquote class="twitter-tweet" data-theme="dark">
    <p lang="en" dir="ltr">Loading tweet...</p>
    <a href="https://twitter.com/anirbanray_/status/1761034462781960351">View Tweet</a>
  </blockquote>
</div>

<div class="showcase-item twitter-embed" data-priority="immediate">
  <blockquote class="twitter-tweet" data-theme="dark">
    <p lang="en" dir="ltr">Loading tweet...</p>
    <a href="https://twitter.com/anirbanray_/status/1789421846225404105">View Tweet</a>
  </blockquote>
</div>

<!-- Remaining tweets - load sequentially after first batch -->
<div class="showcase-item twitter-embed" data-priority="lazy">
  <blockquote class="twitter-tweet-lazy" data-theme="dark" data-tweet-url="https://twitter.com/anirbanray_/status/1660541006658387969">
    <p lang="en" dir="ltr" style="color: #666; text-align: center; padding: 2rem;">Loading...</p>
  </blockquote>
</div>

<div class="showcase-item twitter-embed" data-priority="lazy">
  <blockquote class="twitter-tweet-lazy" data-theme="dark" data-tweet-url="https://twitter.com/anirbanray_/status/1563499736191352835">
    <p lang="en" dir="ltr" style="color: #666; text-align: center; padding: 2rem;">Loading...</p>
  </blockquote>
</div>

<div class="showcase-item linkedin-embed">
  <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:activity:7196888292766674945" height="600" width="100%" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
</div>

<div class="showcase-item linkedin-embed">
  <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:activity:7260904021522010112" height="600" width="100%" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
</div>

</div>

<!-- Twitter Widget Script with lazy loading for remaining tweets -->
<script>
(function() {
  // Load Twitter widget script
  var script = document.createElement('script');
  script.src = 'https://platform.twitter.com/widgets.js';
  script.charset = 'utf-8';
  script.async = true;
  
  script.onload = function() {
    // After Twitter widget loads and renders immediate tweets,
    // sequentially load the lazy tweets
    setTimeout(function() {
      var lazyTweets = document.querySelectorAll('.twitter-tweet-lazy');
      var delay = 0;
      
      lazyTweets.forEach(function(placeholder, index) {
        setTimeout(function() {
          var tweetUrl = placeholder.getAttribute('data-tweet-url');
          var theme = placeholder.getAttribute('data-theme');
          
          // Create proper twitter-tweet blockquote
          var blockquote = document.createElement('blockquote');
          blockquote.className = 'twitter-tweet';
          blockquote.setAttribute('data-theme', theme);
          
          var link = document.createElement('a');
          link.href = tweetUrl;
          link.textContent = 'View Tweet';
          blockquote.appendChild(link);
          
          // Replace placeholder with actual blockquote
          placeholder.parentNode.replaceChild(blockquote, placeholder);
          
          // Render the tweet
          if (window.twttr && window.twttr.widgets) {
            twttr.widgets.load(blockquote.parentNode);
          }
        }, delay);
        
        delay += 500; // Load each lazy tweet 500ms apart
      });
    }, 1500); // Wait 1.5s after widget loads before starting lazy tweets
  };
  
  document.head.appendChild(script);
})();
</script>
