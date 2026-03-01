import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./EditAccountStyle.css";
import defaultProfileImage from "../../assets/noimage.jpg";
import { apiUrl } from "../../utils/api";

export default function EditAccount() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [savedProfileImageUrl, setSavedProfileImageUrl] = useState("");
  const [uploadedPhotoFile, setUploadedPhotoFile] = useState(null);
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const [uploadedPhotoPreviewUrl, setUploadedPhotoPreviewUrl] = useState("");
  const [photoMarkedDeleted, setPhotoMarkedDeleted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch(apiUrl("/accounts/me/"), {
      credentials: "include",
    })
      .then(async (response) => {
        if (!isMounted) return;

        if (response.status === 401) {
          navigate("/Login", { replace: true });
          return;
        }

        if (!response.ok) {
          setFormError("Failed to load account data.");
          setIsLoading(false);
          return;
        }

        const payload = await response.json();
        setUsername(payload.username || "");
        setSavedProfileImageUrl(payload.profile_image_url || "");
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setFormError("Failed to load account data.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (!uploadedPhotoFile) {
      setUploadedPhotoPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedPhotoFile);
    setUploadedPhotoPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [uploadedPhotoFile]);

  const currentPhotoPreview = useMemo(() => {
    if (uploadedPhotoPreviewUrl) return uploadedPhotoPreviewUrl;
    if (photoMarkedDeleted) return defaultProfileImage;
    return savedProfileImageUrl || defaultProfileImage;
  }, [photoMarkedDeleted, savedProfileImageUrl, uploadedPhotoPreviewUrl]);

  const canDeleteSavedPhoto = Boolean(savedProfileImageUrl) && !photoMarkedDeleted;

  const handleUploadPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedPhotoFile(file);
    setUploadedPhotoName(file.name);
    setPhotoMarkedDeleted(false);
  };

  const handleDeletePhoto = () => {
    setUploadedPhotoFile(null);
    setUploadedPhotoName("");
    setPhotoMarkedDeleted(true);
  };

  const handleSave = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setFormError("Username must not be empty.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("username", trimmedUsername);

      if (password) {
        formData.append("password", password);
      }

      if (photoMarkedDeleted) {
        formData.append("remove_profile_image", "true");
      }

      if (uploadedPhotoFile) {
        formData.append("profile_image", uploadedPhotoFile);
      }

      const response = await fetch(apiUrl("/accounts/me/update/"), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.status === 401) {
        navigate("/Login", { replace: true });
        return;
      }

      if (response.status === 409) {
        setFormError("Username already exists.");
        return;
      }

      if (!response.ok) {
        setFormError("Failed to save profile changes.");
        return;
      }

      navigate("/AccountPreview");
    } catch {
      setFormError("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
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
            disabled={isLoading || isSaving}
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
              disabled={isLoading || isSaving}
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
            disabled={isLoading || isSaving}
          />

          <label className="edit-account-label" htmlFor="edit-account-password">
            New Password
          </label>
          <div className="edit-account-password-row">
            <input
              id="edit-account-password"
              className="edit-account-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Leave blank to keep current password"
              disabled={isLoading || isSaving}
            />
            <button
              type="button"
              className="edit-account-eye-button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading || isSaving}
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
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="edit-account-action-button"
              onClick={handleSave}
              disabled={isLoading || isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
