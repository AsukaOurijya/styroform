import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditAccountStyle.css";
import defaultProfileImage from "../../assets/noimage.jpg";
import { loadAccountProfile, saveAccountProfile } from "../../utils/accountStorage";

export default function EditAccount() {
  const navigate = useNavigate();
  const savedAccount = loadAccountProfile();

  const [username, setUsername] = useState(savedAccount.username);
  const [password, setPassword] = useState(savedAccount.password);
  const [showPassword, setShowPassword] = useState(false);
  const [savedHasCustomPhoto, setSavedHasCustomPhoto] = useState(
    Boolean(savedAccount.hasCustomPhoto)
  );
  const [photoMarkedDeleted, setPhotoMarkedDeleted] = useState(false);
  const [uploadedPhotoData, setUploadedPhotoData] = useState("");
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const [formError, setFormError] = useState("");

  const currentPhotoPreview = uploadedPhotoData
    ? uploadedPhotoData
    : photoMarkedDeleted
      ? defaultProfileImage
      : savedAccount.profileImage || defaultProfileImage;

  const canDeleteSavedPhoto = savedHasCustomPhoto && !photoMarkedDeleted;

  const handleUploadPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPhotoData(String(reader.result || ""));
      setUploadedPhotoName(file.name);
      setPhotoMarkedDeleted(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    setUploadedPhotoData("");
    setUploadedPhotoName("");
    setPhotoMarkedDeleted(true);
  };

  const handleSave = () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setFormError("Username and password must not be empty.");
      return;
    }

    let nextProfileImage = savedAccount.profileImage || "";
    let nextHasCustomPhoto = savedHasCustomPhoto;

    if (photoMarkedDeleted) {
      nextProfileImage = "";
      nextHasCustomPhoto = false;
    }

    if (uploadedPhotoData) {
      nextProfileImage = uploadedPhotoData;
      nextHasCustomPhoto = true;
    }

    saveAccountProfile({
      username: trimmedUsername,
      password,
      profileImage: nextProfileImage,
      hasCustomPhoto: nextHasCustomPhoto,
    });

    setSavedHasCustomPhoto(nextHasCustomPhoto);
    setFormError("");
    navigate("/AccountPreview");
  };

  return (
    <main className="edit-account-page">
      <section className="edit-account-card">
        <div className="edit-account-image-column">
          <img
            src={currentPhotoPreview}
            alt="Profile"
            className="edit-account-image"
          />

          <input
            id="account-photo-upload"
            type="file"
            accept="image/*"
            className="edit-account-photo-input"
            onChange={handleUploadPhoto}
          />
          <label htmlFor="account-photo-upload" className="edit-account-photo-button">
            Upload Photo
          </label>
          <p className="edit-account-photo-name">
            {uploadedPhotoName || "No new photo selected"}
          </p>

          {canDeleteSavedPhoto ? (
            <button
              type="button"
              className="edit-account-delete-photo-button"
              onClick={handleDeletePhoto}
            >
              Delete Photo
            </button>
          ) : null}
        </div>

        <div className="edit-account-detail-column">
          <label className="edit-account-label" htmlFor="edit-account-username">
            Username
          </label>
          <input
            id="edit-account-username"
            className="edit-account-input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <label className="edit-account-label" htmlFor="edit-account-password">
            Password
          </label>
          <div className="edit-account-password-row">
            <input
              id="edit-account-password"
              className="edit-account-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="edit-account-eye-button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <span className="material-symbols-outlined edit-account-eye-icon">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>

          {formError ? <p className="edit-account-error">{formError}</p> : null}

          <div className="edit-account-actions">
            <button
              type="button"
              className="edit-account-action-button edit-account-action-secondary"
              onClick={() => navigate("/AccountPreview")}
            >
              Cancel
            </button>
            <button
              type="button"
              className="edit-account-action-button"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
