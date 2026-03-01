import "./LoginStyle.css";
import { Link, useLocation } from "react-router-dom";
import { apiUrl } from "../../utils/api";

export default function Login() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const errorCode = searchParams.get("error");
    const noticeCode = searchParams.get("notice");

    const errorMessage = errorCode === "invalid_credentials"
        ? "Invalid username or password."
        : "";

    const noticeMessage = noticeCode === "registration_success"
        ? "Account created. Please log in."
        : "";

    return(
        <div className="login-page">
            <div className="login-container">
                <h2 className="form-title">Welcome Back!</h2>
                
                <p className="separator"><span>Login</span></p>

                {errorMessage ? (
                    <p className="auth-message auth-message-error">{errorMessage}</p>
                ) : null}
                {noticeMessage ? (
                    <p className="auth-message auth-message-success">{noticeMessage}</p>
                ) : null}

                <form action={apiUrl("/accounts/login/")} method="POST" className="login-form">
                    <div className="input-wrapper">
                        <input type="text" name="username" placeholder="Username" className="input-field" required/>
                        <i className="material-symbols-outlined">account_circle</i>
                    </div>

                    <div className="input-wrapper">
                        <input type="password" name="password" placeholder="Password" className="input-field" required/>
                        <i className="material-symbols-outlined">lock</i>
                    </div>

                    <Link to="/Forgot" className="forgot-pass-link">Forgot Password?</Link>

                    <button className="login-button">
                        Submit 
                    </button>

                    <p className="signup-text">No account yet? <Link to="/Register">Create one here!</Link></p>
                </form>

            </div>
        </div>
    );
} 
