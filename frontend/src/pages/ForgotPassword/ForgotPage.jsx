import "./ForgotStyle.css";
import { Link } from "react-router-dom";

export default function Forgot() {
    return(
        <div className="Forgot-page">
            <div className="Forgot-container">
                <h2 className="form-title">Forgot Password?</h2>
                
                <p className="separator"><span>Change your password here</span></p>

                <form action="#" className="Forgot-form">
                    <div className="input-wrapper">
                        <input type="username" placeholder="Username" className="input-field" required/>
                        <i className="material-symbols-outlined">account_circle</i>
                    </div>

                    <div className="input-wrapper">
                        <input type="password" placeholder="Enter Old Password" className="input-field" required/>
                        <i className="material-symbols-outlined">lock</i>
                    </div>

                    <div className="input-wrapper">
                        <input type="password" placeholder="Enter New Password" className="input-field" required/>
                        <i className="material-symbols-outlined">lock</i>
                    </div>

                    <button className="Forgot-button">
                        Reset Password
                    </button>

                    <p className="signup-text">No account yet? <Link to="/Register">Create one here!</Link></p>
                </form>

            </div>
        </div>
    );
} 
