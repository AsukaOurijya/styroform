import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./FormDetailsStyle.css";

export default function FormDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const form = location.state?.form;
  const canEdit = Boolean(location.state?.canEdit && form?.isOwner);
  const questions = Array.isArray(form?.questions) ? form.questions : [];
  const initialAnswers = useMemo(
    () => Object.fromEntries(questions.map((_, index) => [index, ""])),
    [questions]
  );
  const [answers, setAnswers] = useState(initialAnswers);

  useEffect(() => {
    setAnswers(initialAnswers);
  }, [initialAnswers]);

  const handleSubmitAnswers = (event) => {
    event.preventDefault();
    // Placeholder submit action while backend endpoint is not connected.
    window.alert("Answers submitted.");
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  if (!form) {
    return (
      <main className="form-details-page">
        <section className="form-details-card">
          <h1 className="form-details-title">Form Details</h1>
          <p className="form-details-description">
            No form selected yet. Open a form from Form List first.
          </p>
          <button
            type="button"
            className="form-details-button"
            onClick={() => navigate("/FormList")}
          >
            Back to Form List
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="form-details-page">
      <section className="form-details-card">
        <h1 className="form-details-title">{form.title}</h1>
        <p className="form-details-description">{form.description}</p>
        <p className="form-details-meta">
          Published: {form.publishedDate} • {form.responses} responses
        </p>

        {canEdit ? (
          <div className="form-details-actions">
            <Link to="/EditForm" state={{ form }} className="form-details-button">
              Go to Edit Form
            </Link>
            <button
              type="button"
              className="form-details-button form-details-button-secondary"
              onClick={() => navigate("/FormList")}
            >
              Cancel
            </button>
          </div>
        ) : (
          <form className="take-form" onSubmit={handleSubmitAnswers}>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <div className="take-form-item" key={`${form.id}-q-${index}`}>
                  <label
                    className="take-form-question-label"
                    htmlFor={`question-answer-${index}`}
                  >
                    {question}
                  </label>
                  <textarea
                    id={`question-answer-${index}`}
                    className="take-form-answer-input"
                    placeholder="Type your answer..."
                    value={answers[index] || ""}
                    onChange={(event) =>
                      handleAnswerChange(index, event.currentTarget.value)
                    }
                  />
                </div>
              ))
            ) : (
              <p className="form-details-description">No questions available.</p>
            )}

            <div className="form-details-actions">
              <button type="submit" className="form-details-button">
                Submit
              </button>
              <button
                type="button"
                className="form-details-button form-details-button-secondary"
                onClick={() => navigate("/FormList")}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
