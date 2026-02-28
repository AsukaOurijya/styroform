import { Link, useLocation } from "react-router-dom";

export default function FormDetails() {
  const location = useLocation();
  const form = location.state?.form;
  const canEdit = Boolean(location.state?.canEdit && form?.isOwner);

  if (!form) {
    return (
      <main style={{ padding: "32px 18px" }}>
        <h1>Form Details</h1>
        <p>No form selected yet. Open a form from Form List first.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px 18px" }}>
      <section
        style={{
          maxWidth: "920px",
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e3e6eb",
          borderRadius: "12px",
          padding: "22px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>{form.title}</h1>
        <p>{form.description}</p>
        <p style={{ color: "#647285" }}>
          Published: {form.publishedDate} • {form.responses} responses
        </p>

        {canEdit ? (
          <Link
            to="/EditForm"
            state={{ form }}
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "10px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
              background: "#111111",
              color: "#ffffff",
            }}
          >
            Go to Edit Form
          </Link>
        ) : (
          <button
            type="button"
            style={{
              marginTop: "10px",
              padding: "10px 16px",
              borderRadius: "8px",
              border: 0,
              background: "#111111",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Start Filling
          </button>
        )}
      </section>
    </main>
  );
}
