import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./AccountPreviewStyle.css";
import profilePreviewImage from "../../assets/noimage.jpg";
import { apiUrl } from "../../utils/api";

export default function AccountPreview() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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
          setErrorMessage("Failed to load account profile.");
          return;
        }

        const payload = await response.json();
        setAccount(payload);
      })
      .catch(() => {
        if (isMounted) {
          setErrorMessage("Failed to load account profile.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <main className="account-preview-page">
      <section className="account-preview-card">
        <div className="account-preview-image-column">
          <img
            src={account?.profile_image_url || profilePreviewImage}
            alt="Profile"
            className="account-preview-image"
          />
        </div>

        <div className="account-preview-detail-column">
          <label className="account-preview-label" htmlFor="account-username">
            Username
          </label>
          <input
            id="account-username"
            className="account-preview-input"
            type="text"
            value={account?.username || ""}
            readOnly
          />

          <label className="account-preview-label" htmlFor="account-password">
            Password
          </label>
          <input
            id="account-password"
            className="account-preview-input"
            type="password"
            value="********"
            readOnly
          />

          {errorMessage ? <p className="account-preview-error">{errorMessage}</p> : null}

          <Link to="/EditAccount" className="account-preview-edit-button">
            Edit Profile
          </Link>
        </div>
      </section>
    </main>
  );
}
