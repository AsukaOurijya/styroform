import "./AccountPreviewStyle.css";
import { Link } from "react-router-dom";
import profilePreviewImage from "../../assets/noimage.jpg";
import { loadAccountProfile } from "../../utils/accountStorage";

export default function AccountPreview() {
  const account = loadAccountProfile();

  return (
    <main className="account-preview-page">
      <section className="account-preview-card">
        <div className="account-preview-image-column">
          <img
            src={account.profileImage || profilePreviewImage}
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
            value={account.username}
            readOnly
          />

          <label className="account-preview-label" htmlFor="account-password">
            Password
          </label>
          <input
            id="account-password"
            className="account-preview-input"
            type="password"
            value={account.password}
            readOnly
          />

          <Link to="/EditAccount" className="account-preview-edit-button">
            Edit Profile
          </Link>
        </div>
      </section>
    </main>
  );
}
