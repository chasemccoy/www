export default function ({ mobile = false, collections, blogroll }) {
  const aboutSection = (
    <div>
      <h2>About the editor</h2>
      <p>Chase is a professional designer and amateur human currently working as a design engineer at <a href="https://era.app" target="_blank">Era</a>.</p>
    </div>
  );

  const featuredSection = (
    <div>
      <h2>Featured</h2>
      <ul class='featured'>
        {collections.featuredPosts?.map(post => (
          <li>
            <a href={post.url}>{post.data.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  const socialSection = (
    <div class='Sidebar__social'>
      <h2>Elsewhere</h2>
      <ul class='unstyled'>
        <li>
          <a href='https://chs.is/coding' target="_blank">GitHub</a>
        </li>
        <li>
          <a href='https://chs.is/ig' target="_blank">Instagram</a>
        </li>
        <li>
          <a rel="me" href="https://mastodon.social/@chsmc" target="_blank">Mastodon</a>
        </li>
        <li>
          <a href='https://bsky.app/profile/chsmc.me' target="_blank">Bluesky</a>
        </li>
        <li>
          <a href='https://chs.is/listening' target="_blank">Spotify</a>
        </li>
        <li>
          <a href='https://chs.is/tweeting' target="_blank">Twitter</a>
        </li>
      </ul>
    </div>
  );

  const nowPlayingSection = (
    <div class='Sidebar__nowPlaying'>
      <h2>Now playing</h2>
      <now-playing></now-playing>
    </div>
  );

  const years = Object.keys(collections.postsByYear || {}).reverse();

  const archivesSection = (
    <div class='Sidebar__years'>
      <h2>Archives</h2>

      <ul class='Sidebar__years unstyled inline'>
        {years.map(year => (
          <li>
            <a href={`/${year}`}>{year}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  const bookmarksSection = (
    <div class='Sidebar__bookmarks'>
      <h2>Linked list</h2>
      <p class='color-caption mb-4'>Things that caught my eye on the web, updated sporadically.</p>
      <bookmark-list></bookmark-list>
    </div>
  );

  const blogrollSection = (
    <div class='Sidebar__blogroll'>
      <h2>Blogroll</h2>
      <ul>
        {blogroll?.map(item => (
          <li>
            <a href={item.url} target="_blank" class='unstyled' title={item.name}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  const colophonSection = (
    <p class='Sidebar__colophon color-caption'>
      Typeset in <a href="https://fonts.adobe.com/fonts/source-serif">Source Serif</a> and <a href="https://www.dennisgrauel.com/brunswick-grotesque.html">Brunswick Grotesque</a>. Built with <a href="https://www.11ty.dev">Eleventy</a> and hosted on <a href="https://www.netlify.com">Netlify</a>. Thanks for stopping by ♥
    </p>
  );

  const mainNav = (
    <nav class='Sidebar__nav'>
      <ul class='unstyled'>
        <li>
          <a href="mailto:hi@chsmc.org">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
            </svg>
            Email
          </a>
        </li>

        <li>
          <a href="https://chsmc.org/feed.xml">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9"></path>
              <path d="M4 4a16 16 0 0 1 16 16"></path>
              <circle cx="5" cy="19" r="1"></circle>
            </svg>
            RSS
          </a>
        </li>

        <li>
          <a href="https://books.chsmc.org" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Library
          </a>
        </li>

        <li>
          <a href="https://lab.chsmc.org" target="_blank">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15.9999V7.9999C20.9996 7.64918 20.9071 7.30471 20.7315 7.00106C20.556 6.69742 20.3037 6.44526 20 6.2699L13 2.2699C12.696 2.09437 12.3511 2.00195 12 2.00195C11.6489 2.00195 11.304 2.09437 11 2.2699L4 6.2699C3.69626 6.44526 3.44398 6.69742 3.26846 7.00106C3.09294 7.30471 3.00036 7.64918 3 7.9999V15.9999C3.00036 16.3506 3.09294 16.6951 3.26846 16.9987C3.44398 17.3024 3.69626 17.5545 4 17.7299L11 21.7299C11.304 21.9054 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9054 13 21.7299L20 17.7299C20.3037 17.5545 20.556 17.3024 20.7315 16.9987C20.9071 16.6951 20.9996 16.3506 21 15.9999Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.27002 6.95996L12 12.01L20.73 6.95996" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 22.08V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Lab
          </a>
        </li>

        <li>
          <a href="https://portfolio.chsmc.org" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Portfolio
          </a>
        </li>
      </ul>
    </nav>
  );

  const mainContent = (
    <>
      {aboutSection}
      {featuredSection}
      {socialSection}
      {nowPlayingSection}
      {archivesSection}
      {bookmarksSection}
      {blogrollSection}

      <hr class='dashed'/>

      {colophonSection}
    </>
  );

  return (
    <>
      <p>A weblog by Chase McCoy about exploring and building the world wide web.</p>

      {mainNav}

      {mobile ? (
        <details class='Sidebar__details'>
          <summary class='Sidebar__summary'></summary>
          <div>
            {mainContent}
          </div>
        </details>
      ) : (
        mainContent
      )}
    </>
  )
}
