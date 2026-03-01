import "./RegisterStyle.css";
import { Link, useLocation } from "react-router-dom";
import { apiUrl } from "../../utils/api";

export default function Register() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const errorCode = searchParams.get("error");

    const errorMessage = errorCode === "missing_fields"
        ? "Username and password are required."
        : errorCode === "username_exists"
            ? "Username already exists."
            : "";

    return(
        <div className="register-page">
            <div className="register-container">
                <h2 className="form-title">Create New Account</h2>
                
                <p className="separator"><span>Register</span></p>

                {errorMessage ? (
                    <p className="auth-message auth-message-error">{errorMessage}</p>
                ) : null}

                <form action={apiUrl("/accounts/register/")} method="POST" className="register-form">
                    <div className="input-wrapper">
                        <input type="text" name="username" placeholder="Username" className="input-field" required/>
                        <i className="material-symbols-outlined">account_circle</i>
                    </div>

                    <div className="input-wrapper">
                        <input type="password" name="password" placeholder="Password" className="input-field" required/>
                        <i className="material-symbols-outlined">lock</i>
                    </div>

                    <Link to="/Forgot" className="forgot-pass-link">Forgot Password?</Link>

                    <button className="register-button">
                        Submit 
                    </button>

                    <p className="signup-text">Already have one? <Link to="/Login">Login here!</Link></p>
                </form>

            </div>
        </div>
    );
}
