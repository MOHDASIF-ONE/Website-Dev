import { useSiteInteractions } from '../hooks/useSiteInteractions'
import QuoteForm from '../components/QuoteForm'

export default function HomePage() {
  useSiteInteractions()
  return (
    <>
      
        
      <a className="skip-link" href="#main">Skip to content</a>
      
        
      <header className="site-header" id="siteHeader">
          <div className="site-container header-inner">
            <a className="brand" href="#top" aria-label="Reach Studio home"><span className="brand-symbol" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>reach<span className="brand-period">.</span></span></a>
            <button className="menu-toggle" id="menuToggle" aria-expanded="false" aria-controls="siteNav" aria-label="Open menu"><span></span><span></span></button>
            <nav className="site-nav" id="siteNav" aria-label="Main navigation">
              <a href="#work">Our work</a>
              <a href="#services">What we do</a>
              <a href="#approach">Our approach</a>
              <a href="#pricing">Pricing</a>
              <a className="button button-dark nav-cta" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </header>
      
      
        
      <main id="main">
          <section className="hero-section" id="top">
            <div className="hero-glow hero-glow-one" aria-hidden="true"></div><div className="hero-glow hero-glow-two" aria-hidden="true"></div>
            <div className="site-container hero-layout">
              <div className="hero-copy reveal">
                <p className="eyebrow"><span className="eyebrow-line"></span> Independent web studio · Built around your business</p>
                <h1>We build websites<br />that grow <span>businesses.</span></h1>
                <p className="hero-intro">REACH creates fast, modern digital experiences designed to turn visitors into customers.</p>
                <div className="hero-actions"><a className="button button-primary magnetic" href="#contact">Let’s build yours <span aria-hidden="true">↗</span></a><a className="text-link" href="#work">Explore our work <span aria-hidden="true">↓</span></a></div>
                <div className="hero-proof"><span className="proof-seal" aria-hidden="true">✳</span><div><strong>Direct studio collaboration</strong><small>Strategy, design, and development together.</small></div></div>
              </div>
              <div className="hero-stage reveal" aria-label="A preview of a Reach Studio website design">
                <div className="stage-orbit orbit-a" aria-hidden="true"></div><div className="stage-orbit orbit-b" aria-hidden="true"></div>
                <div className="browser-window">
                  <div className="browser-chrome"><div className="browser-dots"><i></i><i></i><i></i></div><span>northstarwellness.com</span><b>•••</b></div>
                  <div className="site-preview">
                    <div className="preview-nav"><b><span></span> northstar</b><div><i></i><i></i><i></i></div><em>BOOK A VISIT</em></div>
                    <div className="preview-hero"><div><small>WELLNESS, MADE PERSONAL</small><h2>A little more<br /><i>you.</i></h2><p>Care that meets you where you are.</p><span className="preview-cta">Find your path <b>↗</b></span></div><div className="preview-portrait"><span className="portrait-sun"></span><span className="portrait-shape"></span><span className="portrait-leaf"></span></div></div>
                    <div className="preview-bottom"><span>01  /  FEEL BETTER, YOUR WAY</span><span>SCROLL TO EXPLORE  ↓</span></div>
                  </div>
                </div>
                <div className="floating-note note-01"><span className="note-icon note-purple">✳</span><span><strong>Designed with purpose</strong><small>Every detail earns its place</small></span></div>
                <div className="floating-note note-02"><span className="note-icon note-green">↗</span><span><strong>Ready to grow</strong><small>Fast, findable, and yours</small></span></div>
                <div className="stage-caption"><span>01</span><span>Strategy / Design / Development</span><span className="caption-rule"></span></div>
              </div>
            </div>
            <div className="hero-bottom site-container"><span>WEB DESIGN THAT WORKS AS HARD AS YOU DO</span><a href="#work" aria-label="Scroll to selected work">↓</a><span>SCROLL TO EXPLORE</span></div>
          </section>
      
          <section className="trust-strip" aria-label="Reach Studio approach"><div className="site-container trust-inner"><span>Independent studio. Thoughtful by design.</span><div className="trust-metrics"><strong><b>Strategy</b><small>Before design</small></strong><i></i><strong><b>Craft</b><small>Made for real life</small></strong><i></i><strong><b>Care</b><small>After launch</small></strong></div></div></section>
      
          <section className="work-section section-space" id="work">
            <div className="site-container">
              <div className="section-heading reveal"><div><p className="eyebrow">STUDIO CONCEPTS · SELECTED DIRECTIONS</p><h2>Good work speaks<br /><span>for itself.</span></h2></div><p className="section-aside">A set of concept projects showing the thought, character, and craft we bring to every brief.</p></div>
              <div className="work-filters reveal" role="group" aria-label="Filter projects"><button className="active" data-filter="all">All work <span>06</span></button><button data-filter="commerce">Commerce</button><button data-filter="hospitality">Hospitality</button><button data-filter="services">Services</button></div>
              <div className="project-grid">
                <article className="project-card reveal" data-category="hospitality"><a href="#contact" className="project-link" aria-label="Discuss a project like Northline House"><div className="project-visual visual-northline"><div className="project-browser"><div className="mini-browser-bar"><i></i><i></i><i></i><span>northlinehouse.com</span></div><div className="northline-site"><span className="northline-brand">NORTHLINE<br />HOUSE</span><div className="northline-copy"><small>A PLACE TO FIND YOUR PACE</small><strong>Stay a little<br /><em>longer.</em></strong><span>Cabins for the in-between.</span></div><div className="northline-sun"></div><div className="northline-hill hill-one"></div><div className="northline-hill hill-two"></div><div className="northline-hill hill-three"></div><span className="northline-book">CHECK AVAILABILITY  ↗</span></div></div><span className="project-open">View project <b>↗</b></span></div><div className="project-meta"><div><p>HOSPITALITY · BRAND & WEBSITE</p><h3>Northline House</h3></div><span className="project-index">01 / 06</span></div></a></article>
                <article className="project-card reveal" data-category="commerce"><a href="#contact" className="project-link" aria-label="Discuss a project like Goodkind"><div className="project-visual visual-goodkind"><div className="goodkind-top">goodkind<span>®</span><small>OBJECTS FOR EVERYDAY RITUALS</small></div><div className="goodkind-object"><div className="object-vase"></div><div className="object-leaf leaf-one"></div><div className="object-leaf leaf-two"></div><div className="object-book"></div></div><span className="goodkind-label">LESS, BUT<br /><i>BETTER.</i></span><span className="project-open">View project <b>↗</b></span></div><div className="project-meta"><div><p>COMMERCE · BRAND & SHOPIFY</p><h3>Goodkind Goods</h3></div><span className="project-index">02 / 06</span></div></a></article>
                <article className="project-card reveal" data-category="services"><a href="#contact" className="project-link" aria-label="Discuss a project like Fieldwork"><div className="project-visual visual-fieldwork"><div className="fieldwork-top"><b>FIELDWORK</b><span>GARDEN DESIGN STUDIO</span><i>MENU  +</i></div><div className="fieldwork-content"><small>SPACES THAT GROW WITH YOU</small><strong>Closer to<br /><em>the outside.</em></strong><span>Thoughtful gardens for modern living.</span><b>DISCOVER FIELDWORK  ↗</b></div><div className="fieldwork-art"><span></span><i></i><b></b></div><span className="project-open">View project <b>↗</b></span></div><div className="project-meta"><div><p>SERVICES · STRATEGY & WEBSITE</p><h3>Fieldwork Gardens</h3></div><span className="project-index">03 / 06</span></div></a></article>
                <article className="project-card reveal" data-category="commerce"><a href="#contact" className="project-link" aria-label="Discuss a project like Bloom"><div className="project-visual visual-bloom"><div className="bloom-top">BLOOM<span>HOME & BOTANICAL</span></div><div className="bloom-stem"></div><div className="bloom-flower"><i></i><i></i><i></i><i></i><i></i><b></b></div><span className="bloom-copy">Bring a little<br /><em>life home.</em></span><span className="project-open">View project <b>↗</b></span></div><div className="project-meta"><div><p>COMMERCE · E-COMMERCE</p><h3>Bloom Supply</h3></div><span className="project-index">04 / 06</span></div></a></article>
                <article className="project-card reveal" data-category="hospitality"><a href="#contact" className="project-link" aria-label="Discuss a project like Sunday Table"><div className="project-visual visual-sunday"><div className="sunday-top">SUNDAY TABLE<span>NEIGHBORHOOD KITCHEN</span><i>RESERVATIONS</i></div><div className="sunday-plate"><span></span><i></i><b></b></div><div className="sunday-copy"><small>GOOD FOOD. NO OCCASION NEEDED.</small><strong>Pull up<br />a <em>chair.</em></strong></div><span className="project-open">View project <b>↗</b></span></div><div className="project-meta"><div><p>HOSPITALITY · BRAND & WEBSITE</p><h3>Sunday Table</h3></div><span className="project-index">05 / 06</span></div></a></article>
                <article className="project-card project-last reveal" data-category="services"><a href="#contact" className="project-link" aria-label="Discuss a project like Common Ground"><div className="project-visual visual-common"><div className="common-mark">common<span>ground</span></div><div className="common-orb orb-one"></div><div className="common-orb orb-two"></div><div className="common-copy"><small>MAKE ROOM TO GROW</small><strong>Work, with<br /><em>more meaning.</em></strong><span>A better kind of workspace.</span></div><span className="project-open">View project <b>↗</b></span></div><div className="project-meta"><div><p>SERVICES · BRAND & WEBSITE</p><h3>Common Ground</h3></div><span className="project-index">06 / 06</span></div></a></article>
              </div>
              <div className="work-bottom reveal"><span>Have a good one in mind?</span><a className="text-link" href="#contact">Let’s make it real <span>↗</span></a></div>
            </div>
          </section>
      
          <section className="services-section section-space" id="services">
            <div className="site-container"><div className="section-heading reveal"><div><p className="eyebrow">WHAT WE DO</p><h2>Everything your next<br /><span>chapter needs.</span></h2></div><p className="section-aside">From the first big question to the tiny detail that makes it feel like you.</p></div>
              <div className="service-list">
                <article className="service-row reveal"><span className="service-number">01</span><div className="service-icon">✳</div><div className="service-main"><h3>Websites that work</h3><p>Custom-built, quick-loading websites that turn a good first impression into a clear next step.</p></div><span className="service-tags">Design / Development / SEO</span><a href="#contact" aria-label="Ask us about website design">↗</a></article>
                <article className="service-row reveal"><span className="service-number">02</span><div className="service-icon icon-peach">◌</div><div className="service-main"><h3>Brands with a point of view</h3><p>A distinct visual identity and voice that make the right people remember you.</p></div><span className="service-tags">Identity / Art direction / Copy</span><a href="#contact" aria-label="Ask us about branding">↗</a></article>
                <article className="service-row reveal"><span className="service-number">03</span><div className="service-icon icon-green">↗</div><div className="service-main"><h3>Online stores built to sell</h3><p>Easy-to-use storefronts that make finding, choosing, and buying feel effortless.</p></div><span className="service-tags">Shopify / E-commerce / Strategy</span><a href="#contact" aria-label="Ask us about e-commerce">↗</a></article>
                <article className="service-row reveal"><span className="service-number">04</span><div className="service-icon icon-yellow">⌁</div><div className="service-main"><h3>Care that keeps you moving</h3><p>Reliable updates, backups, and ongoing improvements after launch day.</p></div><span className="service-tags">Hosting / Maintenance / Support</span><a href="#contact" aria-label="Ask us about ongoing website care">↗</a></article>
              </div>
            </div>
          </section>
      
          <section className="approach-section" id="approach"><div className="site-container approach-layout"><div className="approach-intro reveal"><p className="eyebrow eyebrow-light">A SMALL STUDIO, BY DESIGN</p><h2>Senior attention.<br /><span>Start to finish.</span></h2><p>You work directly with the people doing the work. No hand-offs, mystery timelines, or disappearing acts—just a thoughtful partner who cares how this turns out.</p><a className="button button-light" href="#contact">Meet your new team <span>↗</span></a></div><div className="approach-points"><article className="approach-point reveal"><span>01</span><div><h3>Clarity before pixels</h3><p>We get to know the business and the people you want to reach before we design a thing.</p></div><i>↗</i></article><article className="approach-point reveal"><span>02</span><div><h3>Made for real life</h3><p>Beautiful on a big screen. Just as thoughtful on the phone in your customer’s hand.</p></div><i>↗</i></article><article className="approach-point reveal"><span>03</span><div><h3>Better after launch</h3><p>We stick around to keep your site secure, current, and ready for what comes next.</p></div><i>↗</i></article></div></div></section>
      
          <section className="process-section section-space"><div className="site-container"><div className="section-heading reveal"><div><p className="eyebrow">A GOOD PROCESS MAKES GOOD WORK</p><h2>From “what if?”<br />to <span>“it’s live.”</span></h2></div><p className="section-aside">Clear steps, good communication, and no surprises along the way.</p></div><div className="process-grid"><article className="process-step reveal"><span className="process-index">01 <i>—</i></span><h3>Get aligned</h3><p>We learn your goals, your customers, and what success looks like to you.</p><small>DISCOVERY & STRATEGY</small></article><article className="process-step reveal"><span className="process-index">02 <i>—</i></span><h3>Find the shape</h3><p>We map the experience and create a visual direction that feels unmistakably yours.</p><small>CONTENT & DESIGN</small></article><article className="process-step reveal"><span className="process-index">03 <i>—</i></span><h3>Make it real</h3><p>We build, refine, and test across devices before your customers ever see it.</p><small>DEVELOPMENT & QA</small></article><article className="process-step reveal"><span className="process-index">04 <i>↗</i></span><h3>Go live, grow on</h3><p>We launch together, then stay close as the business keeps moving.</p><small>LAUNCH & SUPPORT</small></article></div></div></section>
      
          <section className="pricing-section section-space" id="pricing"><div className="site-container"><div className="section-heading reveal"><div><p className="eyebrow">STRAIGHTFORWARD BY DESIGN</p><h2>A clear place<br /><span>to start.</span></h2></div><p className="section-aside">Every project is different. These starting points help us have an honest first conversation.</p></div><div className="pricing-grid">
            <article className="pricing-card reveal"><p className="plan-label">FOUNDATION</p><h3>Starter site</h3><p className="plan-description">A polished home for a business ready to be taken seriously.</p><div className="plan-price"><span>From</span><strong>$249</strong></div><ul><li>One focused page</li><li>Responsive design</li><li>Contact form setup</li><li>Launch support</li></ul><a className="button button-outline" href="#contact" data-plan="Starter">Talk about a starter site <span>↗</span></a></article>
            <article className="pricing-card pricing-featured reveal"><div className="popular-label">MOST REQUESTED</div><p className="plan-label">GROWTH</p><h3>Business site</h3><p className="plan-description">A complete, flexible website for your next stage of growth.</p><div className="plan-price"><span>From</span><strong>$499</strong></div><ul><li>Up to eight pages</li><li>Custom visual direction</li><li>SEO foundations</li><li>Analytics & launch support</li></ul><a className="button button-primary" href="#contact" data-plan="Business">Talk about a business site <span>↗</span></a></article>
            <article className="pricing-card reveal"><p className="plan-label">COMMERCE</p><h3>Online store</h3><p className="plan-description">A considered shopping experience, ready for your products.</p><div className="plan-price"><span>From</span><strong>$899</strong></div><ul><li>Storefront setup</li><li>Product & collection pages</li><li>Payments & shipping</li><li>Training & launch support</li></ul><a className="button button-outline" href="#contact" data-plan="Mega">Talk about an online store <span>↗</span></a></article>
          </div><p className="pricing-note reveal">Need something more specific? <a href="#contact">Tell us what you’re thinking ↗</a></p></div></section>
      
          <section className="next-step-section"><div className="site-container next-step-inner"><div><p className="eyebrow eyebrow-light">GOOD THINGS START WITH A CONVERSATION</p><h2>Have a good feeling<br />about this?</h2></div><a className="button button-light" href="#contact">Tell us what you’re thinking <span>↗</span></a></div></section>
      
          <section className="faq-section section-space"><div className="site-container faq-layout"><div className="faq-heading reveal"><p className="eyebrow">A FEW GOOD QUESTIONS</p><h2>Before we<br /><span>get started.</span></h2><p>Something else on your mind? We’re happy to talk it through.</p><a className="text-link" href="#contact">Ask us anything <span>↗</span></a></div><div className="faq-list reveal"><details><summary>How long does a website project take?<span>+</span></summary><p>Most projects take four to eight weeks, depending on scope and how quickly we can work through content and feedback together. We’ll share a clear timeline before we begin.</p></details><details><summary>What do you need from me to get started?<span>+</span></summary><p>Just a first conversation about your business, goals, and what isn’t working today. We’ll guide you through the rest, including content, imagery, and approvals.</p></details><details><summary>Can you help after the website launches?<span>+</span></summary><p>Yes. We offer ongoing hosting, updates, backups, and support so your site stays in good shape and can grow with your business.</p></details><details><summary>What if I need something beyond these packages?<span>+</span></summary><p>That’s completely fine. The packages are starting points. Tell us what you have in mind and we’ll shape a scope around the actual needs of your project.</p></details></div></div></section>
      
          <section className="contact-section" id="contact"><div className="site-container contact-layout"><div className="contact-copy reveal"><p className="eyebrow eyebrow-light">YOUR NEXT CHAPTER STARTS HERE</p><h2>Let’s make<br /><span>something matter.</span></h2><p>Tell us a little about your business. We’ll get back to you within one business day with a few thoughtful next steps.</p><div className="contact-details"><a href="mailto:hello@reach.studio">hello@reach.studio <span>↗</span></a><span>Working with good people everywhere.</span></div></div><QuoteForm /></div></section>
        </main>
      
      
        
      <footer className="site-footer"><div className="site-container footer-main"><a className="brand brand-footer" href="#top"><span className="brand-symbol" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>reach<span className="brand-period">.</span></span></a><p>Independent by nature.<br />Good on the internet.</p><div className="footer-links"><a href="#work">Work</a><a href="#services">Services</a><a href="#contact">Contact</a><a href="mailto:hello@reach.studio">Email ↗</a></div><a href="#top" className="back-top">Back to top ↑</a></div><div className="site-container footer-bottom"><span>© <span id="yearNow">2026</span> Reach Studio</span><span>Thoughtfully made for the web.</span><a href="#top">Back to top ↑</a></div></footer>
      
        
      <div className="route-progress" id="routeProgress" aria-hidden="true"></div>
      
    </>
  )
}
