import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="expenses-container" style={{ padding: '1rem' }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0.5rem',
            borderBottom: i < 4 ? '1px solid var(--border-light)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              className="skeleton-shimmer"
              style={{ width: 36, height: 36, borderRadius: '9999px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div
                className="skeleton-shimmer"
                style={{ width: 110, height: 16 }}
              />
              <div
                className="skeleton-shimmer"
                style={{ width: 170, height: 12 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              className="skeleton-shimmer"
              style={{ width: 70, height: 18 }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: 85, height: 30, borderRadius: 6 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
