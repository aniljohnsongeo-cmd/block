import React from 'react';

const BuildingDetailModal = ({ building, onClose }) => {
  if (!building) return null;

  // Brick sizes for bottom decorative row
  const brickSizes = [
    { w: 40, h: 24 },
    { w: 28, h: 18 },
    { w: 40, h: 18 },
    { w: 24, h: 24 },
    { w: 32, h: 18 },
  ];

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} role="presentation" />

      <aside className="building-modal" role="dialog" aria-label={building.label}>
        {/* Header */}
        <div className="building-modal__header" style={{ background: '#fff', paddingTop: 28, paddingBottom: 0, paddingLeft: 36, paddingRight: 36, position: 'relative' }}>
          <button className="building-modal__close" onClick={onClose} aria-label="Close panel">✕</button>

          {/* Colour pill */}
          <div
            className="building-modal__pill"
            style={{ background: building.color }}
          >
            <span>{building.icon}</span>
            <span>{building.tag}</span>
          </div>
        </div>

        {/* Body */}
        <div className="building-modal__body">
          <h2 className="building-modal__title">{building.label}</h2>
          <p className="building-modal__description">{building.description}</p>

          <a href={`#${building.section}`} className="building-modal__cta" onClick={onClose}>
            Explore {building.label} <span>→</span>
          </a>

          {/* Decorative LEGO brick row */}
          <div className="building-modal__brick-row">
            {brickSizes.map((b, i) => (
              <div
                key={i}
                className="building-modal__brick"
                style={{
                  width: b.w,
                  height: b.h,
                  background: building.color,
                  opacity: 1 - i * 0.15,
                }}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default BuildingDetailModal;
