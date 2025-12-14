export const data = {
  layout: 'layouts/html.jsx',
  templateClass: 'note',
}

export default async function ({
  page,
  content,
  collections,
  blogroll,
  mobile,
}) {
  return (
    <>
      {/* <div class="sky"></div> */}

      <div class='wrapper'>
        <header>
          <canvas id="c"></canvas>

          <div>
            <h1 class='site-header'>
              <a href='/'>
                chsmc.org
              </a>
            </h1>

            <p>
              <span>
                Software Engineer, Musician, and Artist in Residence at <a href='https://www.the-lab.org'>The Lab</a> in Bristol, UK. 
              </span>
            </p>

            <nav>
              <ul class='unstyled inline'>
                <li>
                  <a href='/about'>About</a>
                </li>
                <li>
                  <a href='/projects'>Projects</a>
                </li>
                <li>
                  <a href='/contact'>Contact</a>
                </li>
              </ul>
            </nav>
          </div>

          {/* <aside class='sidebar mobile'>
          <Sidebar mobile collections={collections} blogroll={blogroll} />
        </aside> */}
        </header>

        <main>
          <div class='content'>{{ html: content }}</div>
        </main>

        {/* <aside class='sidebar desktop'>
        <Sidebar collections={collections} blogroll={blogroll} />
      </aside> */}
      </div>
    </>
  )
}
