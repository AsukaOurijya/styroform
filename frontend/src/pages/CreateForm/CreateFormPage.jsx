import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateFormStyle.css";
import { apiUrl } from "../../utils/api";

const buildQuestionId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export default function CreateForm() {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCoverFile, setFormCoverFile] = useState(null);
  const [formCoverPreview, setFormCoverPreview] = useState("");
  const [formErrors, setFormErrors] = useState({ title: "", cover: "" });
  const [questions, setQuestions] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editor, setEditor] = useState({
    mode: null,
    editingId: null,
    questionText: "",
    answerRequired: false,
  });

  useEffect(() => {
    return () => {
      if (formCoverPreview) {
        URL.revokeObjectURL(formCoverPreview);
      }
    };
  }, [formCoverPreview]);

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormCoverFile(file);
    setFormErrors((prev) => ({ ...prev, cover: "" }));
    setFormCoverPreview((prevPreview) => {
      if (prevPreview) URL.revokeObjectURL(prevPreview);
      return URL.createObjectURL(file);
    });
  };

  const handleSaveForm = async () => {
    const nextErrors = { title: "", cover: "" };

    if (!formTitle.trim()) {
      nextErrors.title = "Form title is required.";
    }

    if (!formCoverFile) {
      nextErrors.cover = "Form cover image is required.";
    }

    setFormErrors(nextErrors);
    if (nextErrors.title || nextErrors.cover) return;

    setIsSaving(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("title", formTitle.trim());
      formData.append("description", formDescription.trim());
      formData.append("cover", formCoverFile);
      formData.append(
        "questions",
        JSON.stringify(
          questions.map((question) => ({
            questionText: question.questionText,
            answerRequired: question.answerRequired,
          }))
        )
      );

      const response = await fetch(apiUrl("/forms/create/"), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setSubmitError(payload.detail || "Failed to save form.");
        return;
      }

      navigate("/FormList");
    } catch {
      setSubmitError("Failed to save form.");
    } finally {
      setIsSaving(false);
    }
  };

  const openCreateEditor = () => {
    setEditor({
      mode: "create",
      editingId: null,
      questionText: "",
      answerRequired: false,
    });
  };

  const openEditEditor = (question) => {
    setEditor({
      mode: "edit",
      editingId: question.id,
      questionText: question.questionText,
      answerRequired: question.answerRequired,
    });
  };

  const closeEditor = () => {
    setEditor({
      mode: null,
      editingId: null,
      questionText: "",
      answerRequired: false,
    });
  };

  const saveQuestion = () => {
    const trimmedText = editor.questionText.trim();
    if (!trimmedText) return;

    if (editor.mode === "edit") {
      setQuestions((prev) =>
        prev.map((question) =>
          question.id === editor.editingId
            ? {
                ...question,
                questionText: trimmedText,
                answerRequired: editor.answerRequired,
              }
            : question
        )
      );
    } else {
      const newQuestion = {
        id: buildQuestionId(),
        questionText: trimmedText,
        answerRequired: editor.answerRequired,
      };
      setQuestions((prev) => [newQuestion, ...prev]);
    }

    closeEditor();
  };

  const deleteQuestion = (questionId) => {
    setQuestions((prev) => prev.filter((question) => question.id !== questionId));
    if (editor.editingId === questionId) closeEditor();
  };

  return (
    <main className="create-form-page">
      <section className="create-form-shell">
        <header className="create-form-header">
          <button
            className="create-form-top-button"
            type="button"
            onClick={() => navigate("/FormList")}
          >
            Cancel
          </button>

          <button
            className="create-form-top-button"
            type="button"
            onClick={handleSaveForm}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Form"}
          </button>
        </header>

        {submitError ? <p className="form-field-error">{submitError}</p> : null}

        <section className="form-meta-card">
          <label className="form-field-label" htmlFor="form-title-input">
            Form Title
          </label>
          <input
            id="form-title-input"
            type="text"
            className="form-title-input"
            placeholder="Enter form title"
            value={formTitle}
            onChange={(event) => {
              setFormTitle(event.target.value);
              if (formErrors.title) {
                setFormErrors((prev) => ({ ...prev, title: "" }));
              }
            }}
          />
          {formErrors.title ? (
            <p className="form-field-error">{formErrors.title}</p>
          ) : null}

          <label className="form-field-label" htmlFor="form-description-input">
            Form Description
          </label>
          <textarea
            id="form-description-input"
            className="form-description-input"
            placeholder="Enter form description"
            value={formDescription}
            onChange={(event) => setFormDescription(event.target.value)}
          />

          <label className="form-field-label" htmlFor="form-cover-input">
            Form Cover
          </label>
          <div className="form-cover-row">
            <input
              id="form-cover-input"
              type="file"
              accept="image/*"
              className="form-cover-input"
              onChange={handleCoverUpload}
            />
            <label htmlFor="form-cover-input" className="form-cover-button">
              Upload Image
            </label>
            <span className="form-cover-filename">
              {formCoverFile ? formCoverFile.name : "No image selected"}
            </span>
          </div>
          {formErrors.cover ? (
            <p className="form-field-error">{formErrors.cover}</p>
          ) : null}

          <div className="form-cover-preview-box">
            {formCoverPreview ? (
              <img
                src={formCoverPreview}
                alt="Form cover preview"
                className="form-cover-preview-image"
              />
            ) : (
              <p className="form-cover-placeholder">
                Upload a cover image to preview it here.
              </p>
            )}
          </div>
        </section>

        <button
          className="add-question-button"
          type="button"
          onClick={openCreateEditor}
        >
          Add New Question (+)
        </button>

        <section className="question-stack">
          {questions.map((question) => (
            <article key={question.id} className="question-card">
              <div className="question-card-content">
                <h2 className="question-card-title">{question.questionText}</h2>
                <p className="question-card-required">
                  answer required: {question.answerRequired ? "true" : "optional"}
                </p>
              </div>

              <div className="question-card-actions">
                <button
                  type="button"
                  className="question-card-action"
                  onClick={() => openEditEditor(question)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="question-card-action"
                  onClick={() => deleteQuestion(question.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>

        {editor.mode && (
          <section className="question-editor-card">
            <div className="question-editor-content">
              <input
                type="text"
                className="question-editor-input"
                placeholder="Enter Question Here"
                value={editor.questionText}
                onChange={(event) =>
                  setEditor((prev) => ({
                    ...prev,
                    questionText: event.target.value,
                  }))
                }
              />

              <label className="question-editor-checkbox-row">
                <input
                  type="checkbox"
                  checked={editor.answerRequired}
                  onChange={(event) =>
                    setEditor((prev) => ({
                      ...prev,
                      answerRequired: event.target.checked,
                    }))
                  }
                />
                <span>answer required</span>
              </label>
            </div>

            <div className="question-editor-actions">
              <button
                type="button"
                className="question-editor-action"
                onClick={saveQuestion}
              >
                Save
              </button>
              <button
                type="button"
                className="question-editor-action"
                onClick={closeEditor}
              >
                Cancel
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
