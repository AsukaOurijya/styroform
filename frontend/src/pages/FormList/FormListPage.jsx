import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./FormListStyle.css";
import noImage from "../../assets/noimage.jpg";
import { apiUrl } from "../../utils/api";

const formatPublishedDate = (timestamp) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function FormList() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [username, setUsername] = useState("");
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const toggleStar = (formId) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId ? { ...form, isStarred: !form.isStarred } : form
      )
    );
  };

  const handleDelete = async (formId) => {
    try {
      const response = await fetch(apiUrl(`/forms/${formId}/delete/`), {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setLoadError(payload.detail || "Failed to delete form.");
        return;
      }

      setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
    } catch {
      setLoadError("Failed to delete form.");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const sessionResponse = await fetch(apiUrl("/accounts/session/"), {
          credentials: "include",
        });

        if (!sessionResponse.ok) {
          if (isMounted) {
            setLoadError("Failed to load session.");
            setIsLoading(false);
          }
          return;
        }

        const sessionPayload = await sessionResponse.json();
        const currentUserId = sessionPayload.user?.id;

        if (isMounted && sessionPayload.user?.username) {
          setUsername(sessionPayload.user.username);
        }

        const formsResponse = await fetch(apiUrl("/forms/"), {
          credentials: "include",
        });

        if (!formsResponse.ok) {
          const payload = await formsResponse.json().catch(() => ({}));
          if (isMounted) {
            setLoadError(payload.detail || "Failed to load forms.");
            setIsLoading(false);
          }
          return;
        }

        const formsPayload = await formsResponse.json();
        const normalizedForms = (formsPayload.forms || []).map((form) => ({
          id: form.id,
          title: form.title,
          description: form.description || "No description.",
          publishedDate: formatPublishedDate(form.created_at),
          ownerUsername: form.owner_username || "Unknown",
          isOwner: currentUserId === form.owner_id,
          imageSrc: form.cover_url || null,
          isStarred: false,
          questions: Array.isArray(form.questions)
            ? form.questions
                .map((question) => {
                  if (typeof question === "string") return question;
                  return question?.prompt || "";
                })
                .filter(Boolean)
            : [],
        }));

        if (isMounted) {
          setForms(normalizedForms);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoadError("Failed to load forms.");
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredForms = forms.filter((form) => {
    if (activeFilter === "my") return form.isOwner;
    if (activeFilter === "starred") return form.isStarred;
    return true;
  });

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
          {isLoading ? (
            <p className="form-list-empty">Loading forms...</p>
          ) : loadError ? (
            <p className="form-list-empty">{loadError}</p>
          ) : filteredForms.length === 0 ? (
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
                    Published: {form.publishedDate} • Created by {form.ownerUsername}
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
