'use client';

export default function Minimal3DHaloChamber() {
  return (
    <div className="halo-chamber" aria-hidden="true">
      <div className="halo-chamber__bg" />

      <div className="halo-chamber__glow halo-chamber__glow--red" />
      <div className="halo-chamber__glow halo-chamber__glow--blue" />

      <div className="halo-chamber__halo">
        <span className="halo-chamber__rim halo-chamber__rim--outer" />
        <span className="halo-chamber__rim halo-chamber__rim--inner" />
        <span className="halo-chamber__highlight" />
      </div>
    </div>
  );
}