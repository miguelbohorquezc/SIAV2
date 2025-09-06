import { memo } from 'react';

function DashboardPageBase() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-4">Panel</h1>
        <p className="subtitle is-6">Bienvenido a SIA COLINA v2.</p>
      </div>
    </section>
  );
}

export default memo(DashboardPageBase);
