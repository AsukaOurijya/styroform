import "./HeroStyle.css";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-card">
        <h1 className="hero-title">Build, Share, Collect Effortlessly.</h1>
        <p className="hero-subtitle">
          Build fast forms and collect responses with Styroform.
        </p>
        <button className="hero-button" type="button">
          Explore Forms
        </button>
        <div className="hero-divider" />
      </div>
    </section>
  );
}
