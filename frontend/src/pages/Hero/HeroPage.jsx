import "./HeroStyle.css";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-card">
        <h1 className="hero-title">Build, Share, Collect Effortlessly.</h1>
        <p className="hero-subtitle">
          Build fast forms and collect responses with Styroform.
        </p>
        <Link to="/FormList">
          <button className="hero-button" type="button">
            Explore Forms
          </button>
        </Link>
        <div className="hero-divider" />
      </div>
    </section>
  );
}
