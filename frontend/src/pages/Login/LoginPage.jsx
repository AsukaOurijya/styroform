import "./LoginStyle.css";
import { Link } from "react-router-dom";

export default function Login() {
    return(
        <div className="login-page">
            <div className="login-container">
                <h2 className="form-title">Welcome Back!</h2>
                
                <p className="separator"><span>Login</span></p>

                <form action="#" className="login-form">
                    <div className="input-wrapper">
                        <input type="username" placeholder="Username" className="input-field" required/>
                        <i className="material-symbols-outlined">account_circle</i>
                    </div>

                    <div className="input-wrapper">
                        <input type="password" placeholder="Password" className="input-field" required/>
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
