import { useState } from "react";
import { Link } from "react-router-dom";
import "./FormListStyle.css";
import formPreviewImage from "../../assets/landscape.jpg";
import noImage from "../../assets/noimage.jpg";

export default function FormList() {
  const [forms, setForms] = useState([
    {
      id: 1,
      title: "Customer Satisfaction Survey",
      description:
        "Gather user feedback about product quality, support speed, and overall satisfaction in one streamlined form.",
      publishedDate: "Feb 28, 2026",
      responses: 43,
      isOwner: true,
      imageSrc: formPreviewImage,
    },
    {
      id: 2,
      title: "Campus Event Registration",
      description:
        "Register for workshops, keynote sessions, and networking activities with a single multi-step form.",
      publishedDate: "Feb 26, 2026",
      responses: 112,
      isOwner: false,
      imageSrc: null,
    },
  ]);

  const handleDelete = (formId) => {
    setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
  };

  return (
    <main className="form-list-page">
      <section className="form-list-container">
        <header className="form-list-header">
          <h1 className="form-list-title">Welcome Back, username!</h1>
          <p className="form-list-subtitle">
            Build or Fill form, effortlessly with Styroform.
          </p>
        </header>

        <div className="form-list-filter-row">
          <div className="form-list-tabs" role="tablist" aria-label="Form filters">
            <button className="form-list-tab" type="button">
              All Forms
            </button>
            <button className="form-list-tab is-active" type="button">
              My Forms
            </button>
            <button className="form-list-tab is-active" type="button">
              Starred Forms
            </button>
          </div>
        </div>

        <section className="form-card-grid">
          {forms.map((form) => (
            <article key={form.id} className="form-card">
              <div className="form-card-media">
                <img
                  src={form.imageSrc || noImage}
                  alt={`${form.title} preview`}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = noImage;
                  }}
                />
              </div>

              <div className="form-card-content">
                <h2 className="form-card-title">{form.title}</h2>
                <p className="form-card-description">{form.description}</p>
                <p className="form-card-meta">
                  Published: {form.publishedDate} • {form.responses} responses
                </p>
              </div>

              <aside
                className={`form-card-action-panel ${
                  form.isOwner ? "is-owner" : ""
                }`}
              >
                {form.isOwner ? (
                  <>
                    <Link
                      to="/FormDetails"
                      state={{ form, canEdit: true, action: "edit" }}
                      className="form-card-action form-card-edit"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="form-card-action form-card-delete"
                      onClick={() => handleDelete(form.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <Link
                    to="/FormDetails"
                    state={{ form, canEdit: false, action: "take" }}
                    className="form-card-action form-card-open"
                  >
                    Take Form
                  </Link>
                )}
              </aside>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
