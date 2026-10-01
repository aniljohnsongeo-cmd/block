import React from 'react';
import { NARRATIVE, SCROLL_PHASES } from '../../utils/constants';
import { mapRange } from '../../utils/legoGeometry';

const ScrollOverlay = ({ scrollProgress = 0 }) => {
  let activeNarrative = NARRATIVE[0];
  for (const n of NARRATIVE) {
    const phase = SCROLL_PHASES[n.phase];
    if (phase && scrollProgress >= phase.start) activeNarrative = n;
  }

  const showHint = scrollProgress < 0.04;

  return (
    <>
      {/* Scroll hint at very start */}
      <div className={`scroll-hint ${!showHint ? 'hidden' : ''}`}>
        <span className="scroll-hint__text">Scroll</span>
        <div className="scroll-hint__arrow" />
      </div>

      {/* Editorial narrative text */}
      <div className="scroll-overlay" aria-live="polite">
        <div className="scroll-overlay__content">
          {NARRATIVE.map((n) => {
            const phase = SCROLL_PHASES[n.phase];
            if (!phase) return null;
            const isActive = activeNarrative.phase === n.phase;
            const fadeIn  = mapRange(scrollProgress, phase.start, phase.start + 0.05, 0, 1);
            const fadeOut = phase.end < 1
              ? mapRange(scrollProgress, phase.end - 0.05, phase.end, 1, 0)
              : 1;
            const opacity = isActive ? Math.min(fadeIn, fadeOut) : 0;

            return (
              <div
                key={n.phase}
                className="narrative-block"
                style={{
                  opacity,
                  transform: `translateY(${isActive ? 0 : 16}px)`,
                  transition: 'opacity 0.45s ease, transform 0.45s ease',
                  pointerEvents: 'none',
                  position: 'absolute',
                }}
              >
                <span className="narrative-eyebrow">{n.eyebrow}</span>
                <h1 className="narrative-headline">
                  {n.headline.split('\n').map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
                {n.sub && <p className="narrative-sub">{n.sub}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right-side progress indicator */}
      <div className="scroll-indicator">
        <div className="scroll-indicator__track">
          <div
            className="scroll-indicator__fill"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="phase-dots">
          {NARRATIVE.map((n) => (
            <div
              key={n.phase}
              className={`phase-dot ${activeNarrative.phase === n.phase ? 'active' : ''}`}
              title={n.eyebrow}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ScrollOverlay;
