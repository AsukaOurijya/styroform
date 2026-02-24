import "./RegisterStyle.css";

export default function Register() {
    return(
        <div className="register-page">
            <div className="register-container">
                <h2 className="form-title">Create New Account</h2>
                
                <p className="separator"><span>Register</span></p>

                <form action="#" className="register-form">
                    <div className="input-wrapper">
                        <input type="username" placeholder="Username" className="input-field" required/>
                        <i className="material-symbols-outlined">account_circle</i>
                    </div>

                    <div className="input-wrapper">
                        <input type="password" placeholder="Password" className="input-field" required/>
                        <i className="material-symbols-outlined">lock</i>
                    </div>

                    <a href="#" className="forgot-pass-link">Forgot Password?</a>

                    <button className="register-button">
                        Submit 
                    </button>

                    <p className="signup-text">Already have one? <a href="#">Login here!</a></p>
                </form>

            </div>
        </div>
    );
}
