import React from 'react';

const Navbar = ({ scrollProgress = 0 }) => {
  const visible = scrollProgress > 0.015;

  return (
    <nav
      className="navbar"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div className="navbar__logo">
        {/* 2×2 LEGO stud grid */}
        <div className="navbar__stud" aria-hidden="true">
          <span className="navbar__stud-dot" />
          <span className="navbar__stud-dot" />
          <span className="navbar__stud-dot" />
          <span className="navbar__stud-dot" />
        </div>
        <span className="navbar__brand">Digital Studio</span>
      </div>

      {/* Links */}
      <nav className="navbar__links" aria-label="Site sections">
        {['Work', 'Services', 'About', 'AI'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="navbar__link">
            {item}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <a href="#contact" className="navbar__cta-btn">
        Let's build →
      </a>
    </nav>
  );
};

export default Navbar;
