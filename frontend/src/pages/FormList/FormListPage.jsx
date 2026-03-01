import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./FormListStyle.css";
import formPreviewImage from "../../assets/landscape.jpg";
import noImage from "../../assets/noimage.jpg";
import { apiUrl } from "../../utils/api";

export default function FormList() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [username, setUsername] = useState("");
  const [forms, setForms] = useState([
    {
      id: 1,
      title: "Customer Satisfaction Factory",
      description:
        "Gather user feedback about product quality, support speed, and overall satisfaction in one streamlined form.",
      publishedDate: "Feb 28, 2026",
      responses: 43,
      isOwner: true,
      imageSrc: formPreviewImage,
      isStarred: false,
      questions: [
        "How satisfied are you with our product quality?",
        "How would you rate our support team's response time?",
        "Which feature gives you the most value?",
        "What should we improve first to raise your satisfaction?",
      ],
    },
    {
      id: 2,
      title: "Campus Event Organization",
      description:
        "Register for workshops, keynote sessions, and networking activities with a single multi-step form.",
      publishedDate: "Feb 26, 2026",
      responses: 112,
      isOwner: false,
      imageSrc: null,
      isStarred: false,
      questions: [
        "Which event division do you want to join?",
        "Why do you want to join this event organization?",
        "What relevant experience do you have?",
        "How many hours per week can you commit?",
      ],
    },
  ]);

  const handleDelete = (formId) => {
    setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
  };

  const toggleStar = (formId) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId ? { ...form, isStarred: !form.isStarred } : form
      )
    );
  };

  const filteredForms = forms.filter((form) => {
    if (activeFilter === "my") return form.isOwner;
    if (activeFilter === "starred") return form.isStarred;
    return true;
  });

  useEffect(() => {
    let isMounted = true;

    fetch(apiUrl("/accounts/session/"), {
      credentials: "include",
    })
      .then(async (response) => {
        if (!isMounted || !response.ok) return;
        const payload = await response.json();
        if (payload.authenticated && payload.user?.username) {
          setUsername(payload.user.username);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="form-list-page">
      <section className="form-list-container">
        <header className="form-list-header">
          <h1 className="form-list-title">Welcome Back, {username || "User"}!</h1>
          <p className="form-list-subtitle">
            Build or Fill form, effortlessly with Styroform.
          </p>
        </header>

        <div className="form-list-filter-row">
          <div className="form-list-tabs" role="tablist" aria-label="Form filters">
            <button
              className={`form-list-tab ${activeFilter === "all" ? "is-active" : ""}`}
              type="button"
              onClick={() => setActiveFilter("all")}
            >
              All Forms
            </button>
            <button
              className={`form-list-tab ${activeFilter === "my" ? "is-active" : ""}`}
              type="button"
              onClick={() => setActiveFilter("my")}
            >
              My Forms
            </button>
            <button
              className={`form-list-tab ${activeFilter === "starred" ? "is-active" : ""}`}
              type="button"
              onClick={() => setActiveFilter("starred")}
            >
              Starred Forms
            </button>
          </div>
        </div>

        <section className="form-card-grid">
          {filteredForms.length === 0 ? (
            <p className="form-list-empty">No forms found for this filter.</p>
          ) : (
            filteredForms.map((form) => (
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
                        to="/EditForm"
                        state={{ form }}
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
                      <button
                        type="button"
                        className={`form-card-action form-card-star ${
                          form.isStarred ? "is-starred" : ""
                        }`}
                        onClick={() => toggleStar(form.id)}
                      >
                        <span className="form-card-star-icon">
                          {form.isStarred ? "★" : "☆"}
                        </span>
                        {form.isStarred ? "Starred" : "Star"}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/FormDetails"
                        state={{ form, canEdit: false, action: "take" }}
                        className="form-card-action form-card-open"
                      >
                        Take Form
                      </Link>
                      <button
                        type="button"
                        className={`form-card-action form-card-star ${
                          form.isStarred ? "is-starred" : ""
                        }`}
                        onClick={() => toggleStar(form.id)}
                      >
                        <span className="form-card-star-icon">
                          {form.isStarred ? "★" : "☆"}
                        </span>
                        {form.isStarred ? "Starred" : "Star"}
                      </button>
                    </>
                  )}
                </aside>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
