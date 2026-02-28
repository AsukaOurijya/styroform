import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EditFormStyle.css";

const buildQuestionId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];

  return questions
    .map((question, index) => {
      if (typeof question === "string") {
        return {
          id: `seed-${index}`,
          questionText: question,
          answerRequired: false,
        };
      }

      if (question && typeof question === "object") {
        return {
          id: question.id ?? `seed-${index}`,
          questionText: question.questionText ?? "",
          answerRequired: Boolean(question.answerRequired),
        };
      }

      return null;
    })
    .filter(Boolean);
};

export default function EditForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const sourceForm = location.state?.form;

  const [formTitle, setFormTitle] = useState(sourceForm?.title || "");
  const [formDescription, setFormDescription] = useState(
    sourceForm?.description || ""
  );
  const [formCoverFile, setFormCoverFile] = useState(null);
  const [formCoverPreview, setFormCoverPreview] = useState(
    sourceForm?.imageSrc || ""
  );
  const [objectPreviewUrl, setObjectPreviewUrl] = useState("");
  const [formErrors, setFormErrors] = useState({ title: "", cover: "" });
  const [questions, setQuestions] = useState(() =>
    normalizeQuestions(sourceForm?.questions)
  );
  const [editor, setEditor] = useState({
    mode: null,
    editingId: null,
    questionText: "",
    answerRequired: false,
  });

  useEffect(() => {
    return () => {
      if (objectPreviewUrl) {
        URL.revokeObjectURL(objectPreviewUrl);
      }
    };
  }, [objectPreviewUrl]);

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectPreviewUrl) {
      URL.revokeObjectURL(objectPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);

    setObjectPreviewUrl(previewUrl);
    setFormCoverFile(file);
    setFormCoverPreview(previewUrl);
    setFormErrors((prev) => ({ ...prev, cover: "" }));
  };

  const handleSaveForm = () => {
    const nextErrors = { title: "", cover: "" };

    if (!formTitle.trim()) {
      nextErrors.title = "Form title is required.";
    }

    if (!formCoverFile && !formCoverPreview) {
      nextErrors.cover = "Form cover image is required.";
    }

    setFormErrors(nextErrors);
    if (nextErrors.title || nextErrors.cover) return;

    // Placeholder save action while backend is not connected.
    window.alert("Form changes saved locally.");
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
    if (editor.editingId === questionId) {
      closeEditor();
    }
  };

  return (
    <main className="edit-form-page">
      <section className="edit-form-shell">
        <header className="edit-form-header">
          <button
            className="edit-form-top-button"
            type="button"
            onClick={() => navigate("/FormList")}
          >
            Cancel
          </button>

          <button
            className="edit-form-top-button"
            type="button"
            onClick={handleSaveForm}
          >
            Save Form
          </button>
        </header>

        <section className="form-meta-card">
          <label className="form-field-label" htmlFor="edit-form-title-input">
            Form Title
          </label>
          <input
            id="edit-form-title-input"
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

          <label className="form-field-label" htmlFor="edit-form-description-input">
            Form Description
          </label>
          <textarea
            id="edit-form-description-input"
            className="form-description-input"
            placeholder="Enter form description"
            value={formDescription}
            onChange={(event) => setFormDescription(event.target.value)}
          />

          <label className="form-field-label" htmlFor="edit-form-cover-input">
            Form Cover
          </label>
          <div className="form-cover-row">
            <input
              id="edit-form-cover-input"
              type="file"
              accept="image/*"
              className="form-cover-input"
              onChange={handleCoverUpload}
            />
            <label htmlFor="edit-form-cover-input" className="form-cover-button">
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
