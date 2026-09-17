import {
  capabilityGroups,
  earlierRoles,
  portfolioProjects,
  resumeRoles,
} from "../content/resume";

const contactLinks = [
  { label: "Email", href: "mailto:thomvaladez@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/thomasvaladez/" },
  { label: "GitHub", href: "https://github.com/th-m" },
] as const;

const outcomeMetrics = [
  { value: "10+", label: "Years building products and platforms" },
  { value: "3.6×", label: "Merged PR throughput, from ~8 to ~29 per week" },
  { value: "7×+", label: "Faster builds, from 15+ minutes to under 2" },
  { value: "42+ / 47", label: "Legacy pages / REST APIs migrated" },
] as const;

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>;
}

export function ResumePage() {
  return (
    <article className="resume-page" id="resume">
      <header className="resume-hero">
        <div className="resume-hero__meta">
          <p className="eyebrow">Résumé / Selected work</p>
          <p>St. George, Utah · Remote</p>
        </div>
        <div className="resume-hero__heading">
          <h1>Thomas <span>Valadez</span></h1>
          <div>
            <p className="resume-role">Principal Engineer · Engineering Leader · Founding Engineer</p>
            <p className="resume-lede">
              I make complex product and software systems understandable enough to change—connecting
              durable architecture, developer experience, operational reliability, and measurable
              business outcomes.
            </p>
          </div>
        </div>
        <div className="resume-actions" aria-label="Résumé actions and contact links">
          <button type="button" onClick={() => window.print()}>
            Print / save PDF <span aria-hidden="true">↓</span>
          </button>
          {contactLinks.map((link) => (
            <a
              href={link.href}
              key={link.label}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label} {link.href.startsWith("http") ? <ExternalArrow /> : <span aria-hidden="true">→</span>}
            </a>
          ))}
        </div>
      </header>

      <section className="resume-outcomes" aria-labelledby="resume-outcomes-title">
        <div className="resume-section-heading">
          <p className="section-index">01</p>
          <div>
            <p className="eyebrow">Selected outcomes</p>
            <h2 id="resume-outcomes-title">Architecture is useful when it changes what a team can do.</h2>
          </div>
        </div>
        <dl className="resume-metrics">
          {outcomeMetrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="resume-experience" aria-labelledby="resume-experience-title">
        <div className="resume-section-heading">
          <p className="section-index">02</p>
          <div>
            <p className="eyebrow">Experience</p>
            <h2 id="resume-experience-title">Product intent, carried through the system.</h2>
          </div>
        </div>
        <div className="resume-timeline">
          {resumeRoles.map((role, index) => (
            <section className="resume-role-entry" key={`${role.company}-${role.title}`}>
              <div className="resume-role-entry__meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{role.period}</p>
                {role.location ? <p>{role.location}</p> : null}
              </div>
              <div className="resume-role-entry__body">
                <p className="eyebrow">{role.company}</p>
                <h3>{role.title}</h3>
                <p className="resume-role-entry__summary">{role.summary}</p>
                <ul>
                  {role.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
              </div>
            </section>
          ))}
        </div>
        <div className="resume-earlier">
          <p className="eyebrow">Earlier roles</p>
          <ul>
            {earlierRoles.map((role) => <li key={role}>{role}</li>)}
          </ul>
        </div>
      </section>

      <section className="resume-portfolio" aria-labelledby="resume-portfolio-title">
        <div className="resume-section-heading">
          <p className="section-index">03</p>
          <div>
            <p className="eyebrow">Selected portfolio</p>
            <h2 id="resume-portfolio-title">Running systems, not just diagrams.</h2>
          </div>
        </div>
        <div className="resume-project-grid">
          {portfolioProjects.map((project, index) => (
            <a href={project.href} target="_blank" rel="noreferrer" key={project.title}>
              <span className="resume-project__number">{String(index + 1).padStart(2, "0")}</span>
              <span className="eyebrow">{project.label}</span>
              <strong>{project.title} <ExternalArrow /></strong>
              <span className="resume-project__description">{project.description}</span>
              <span className="resume-project__technologies">{project.technologies.join(" · ")}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="resume-capabilities" aria-labelledby="resume-capabilities-title">
        <div className="resume-section-heading">
          <p className="section-index">04</p>
          <div>
            <p className="eyebrow">Capabilities</p>
            <h2 id="resume-capabilities-title">Broad enough to connect the boundaries.</h2>
          </div>
        </div>
        <div className="resume-capability-grid">
          {capabilityGroups.map((group) => (
            <section key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.items.join(" · ")}</p>
            </section>
          ))}
        </div>
        <div className="resume-education">
          <p className="eyebrow">Education</p>
          <p><strong>B.S. Computer Information Technology</strong>, Minor in Computer Science</p>
          <p>Utah Tech University</p>
        </div>
      </section>

      <footer className="resume-closing">
        <p>Interested in systems that are easier to understand, operate, and evolve?</p>
        <a href="mailto:thomvaladez@gmail.com">Let’s talk <span aria-hidden="true">→</span></a>
      </footer>
    </article>
  );
}
