import { useLocation } from "react-router-dom";

export default function EditForm() {
  const location = useLocation();
  const form = location.state?.form;

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
        <h1 style={{ marginTop: 0 }}>Edit Form</h1>
        <p>
          {form
            ? `Editing: ${form.title}`
            : "No form selected. Open Form Details before editing."}
        </p>
      </section>
    </main>
  );
}
