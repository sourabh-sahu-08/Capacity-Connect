import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => (
  <main className="cc-page">
    <video className="cc-background-video" autoPlay muted loop playsInline aria-hidden="true" preload="metadata">
      <source src="/water.mp4" type="video/mp4" />
    </video>
    <div className="cc-container">
      <nav className="cc-nav" aria-label="Main navigation">
        <Link className="cc-wordmark" to="/">CAPACITY <i>CONNECT</i></Link>
        <div className="cc-nav-links"><a href="#platform">Platform</a><a href="#intelligence">Solutions</a><a href="#roles">Enterprise</a><a href="#resources">Resources</a></div>
        <div className="cc-nav-actions"><Link className="cc-login" to="/login">Log in</Link><Link className="cc-button" to="/register">Get started <ArrowRight size={14} /></Link></div>
      </nav>

      <section className="cc-hero">
        <div className="cc-hero-copy">
          <h1 className="cc-serif">Build stronger<br />capabilities.</h1>
          <p>Understand skills, identify capability gaps, and build smarter growth paths across your organization.</p>
          <div className="cc-hero-actions"><Link className="cc-button cc-button--bright" to="/register">Get started <ArrowRight size={15} /></Link><a className="cc-button cc-button--quiet" href="#platform">Explore platform <ArrowRight size={15} /></a></div>
          <div className="cc-hero-meta"><span /> Signal from every skill, team and moment</div>
        </div>
      </section>
    </div>

    <section className="cc-section" id="platform"><div className="cc-container">
      <div className="cc-section-heading"><h2 className="cc-serif">See what your workforce<br />can do next.</h2><p>One clear view of strengths, momentum and the opportunities that will move your people forward.</p></div>
      <div className="cc-data-visual" id="intelligence">
        <div className="cc-graph"><svg viewBox="0 0 620 270" role="img" aria-label="Capability growth trajectory chart"><path className="muted-line" d="M0 213H620M0 145H620M0 77H620"/><path d="M8 229 C78 218, 100 199, 151 204 S222 177, 269 183 S334 122, 390 136 S457 86, 514 94 S565 39, 613 48"/><circle className="cc-graph-dot" cx="151" cy="204" r="6"/><circle className="cc-graph-dot" cx="390" cy="136" r="6"/><circle className="cc-graph-dot" cx="613" cy="48" r="6"/></svg></div>
        <div className="cc-metrics"><div><div className="cc-metric-top">Organizational readiness</div><div className="cc-metric-score">82<small> / 100</small></div></div>{[['Communication','88%'],['Leadership','74%'],['Data fluency','91%']].map(([name, value]) => <div key={name}><div className="cc-bar-label"><span>{name}</span><span>{value}</span></div><div className="cc-bar"><i style={{width:value}} /></div></div>)}</div>
      </div>
    </div></section>

    <section className="cc-section" id="resources"><div className="cc-container"><div className="cc-section-heading"><h2 className="cc-serif">From insight<br />to progress.</h2><p>Make capability a shared language across every layer of your organization.</p></div><div className="cc-feature-list">{[['01','Capability intelligence','Reveal the strengths and gaps shaping your organization.'],['02','Growth paths','Turn skill signals into focused, personal next steps.'],['03','Readiness planning','Build teams ready for the work that is coming.']].map(([number,title,text]) => <div className="cc-feature" key={number}><span className="cc-feature-num">{number}</span><div><h3>{title}</h3><p>{text}</p></div><ChevronRight className="cc-feature-arrow" size={18}/></div>)}</div></div></section>

    <section className="cc-section" id="roles"><div className="cc-container"><div className="cc-section-heading"><h2 className="cc-serif">One platform.<br />Different paths.</h2><p>Purpose-built perspectives for the people who learn, develop and lead.</p></div><div className="cc-role-grid">{[['01','Learner','Build the skills that move your career forward.'],['02','Trainer','Design learning experiences that actually work.'],['03','Manager','Understand team capability and readiness.']].map(([number,title,text]) => <article className="cc-role" key={title}><div><small>{number}</small><h3>{title}</h3><p>{text}</p></div><Link to="/register">Choose this path <ArrowRight size={14}/></Link></article>)}</div></div></section>
    <footer className="cc-footer cc-container"><span>© 2026 Capacity Connect</span><span>Intelligence. Capability. Precision.</span></footer>
  </main>
);
