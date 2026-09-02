'use client';

export default function EnergyVortexBackground() {
  return (
    <div className="energy-vortex" aria-hidden="true">
      <div className="energy-vortex__base" />

      <div className="energy-vortex__beam energy-vortex__beam--red" />
      <div className="energy-vortex__beam energy-vortex__beam--blue" />

      <div className="energy-vortex__ring energy-vortex__ring--one" />
      <div className="energy-vortex__ring energy-vortex__ring--two" />
      <div className="energy-vortex__ring energy-vortex__ring--three" />

      <div className="energy-vortex__shockwave" />

      <div className="energy-vortex__flare energy-vortex__flare--left" />
      <div className="energy-vortex__flare energy-vortex__flare--right" />

      <div className="energy-vortex__spark energy-vortex__spark--1" />
      <div className="energy-vortex__spark energy-vortex__spark--2" />
      <div className="energy-vortex__spark energy-vortex__spark--3" />
      <div className="energy-vortex__spark energy-vortex__spark--4" />
      <div className="energy-vortex__spark energy-vortex__spark--5" />
      <div className="energy-vortex__spark energy-vortex__spark--6" />
    </div>
  );
}