import React, { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import useAuthStore from "@/stores/AuthStore";
import * as styles from "./LoginPage.module.css";

function LoginPage() {
    const { user, login } = useAuthStore();
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handleGoogleLogin = async () => {
        try { setError(""); await login(); }
        catch (e: any) { setError(e.message); }
    };

    const handleEmailAuth = async () => {
        setError("");
        setResetSent(false);
        if (!email.trim() || !password.trim()) {
            setError("Email and password are required");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email.trim(), password);
            } else {
                await signInWithEmailAndPassword(auth, email.trim(), password);
            }
        } catch (e: any) {
            const code = e.code;
            if (code === "auth/user-not-found") setError("No account found with this email");
            else if (code === "auth/wrong-password") setError("Incorrect password");
            else if (code === "auth/email-already-in-use") setError("An account with this email already exists");
            else if (code === "auth/weak-password") setError("Password too weak (min 6 characters)");
            else if (code === "auth/invalid-email") setError("Invalid email address");
            else if (code === "auth/too-many-requests") setError("Too many attempts. Try again later.");
            else setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setError("");
        setResetSent(false);
        if (!email.trim()) { setError("Enter your email address first"); return; }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email.trim());
            setResetSent(true);
        } catch (e: any) {
            const code = e.code;
            if (code === "auth/user-not-found") setError("No account found with this email");
            else if (code === "auth/invalid-email") setError("Invalid email address");
            else if (code === "auth/too-many-requests") setError("Too many requests. Try again later.");
            else setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <span className={styles.icon}>✓</span>
                    <h2 className={styles.title}>Welcome back!</h2>
                    <p className={styles.subtitle}>Logged in as {user.displayName || user.email}</p>
                    <button
                        className={styles.logoutBtn}
                        onClick={() => useAuthStore.getState().logout()}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <span className={styles.icon}>♔</span>
                <h2 className={styles.title}>{isSignup ? "Create Account" : "Welcome Back"}</h2>
                <p className={styles.subtitle}>{isSignup ? "Sign up with email" : "Sign in to continue"}</p>

                <button className={styles.googleBtn} onClick={handleGoogleLogin}>
                    <svg viewBox="0 0 48 48" style={{width:20,height:20}}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/>
                        <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                    Continue with Google
                </button>

                <div className={styles.divider}><span>or</span></div>

                <div className={styles.emailAuth}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => { setError(""); setResetSent(false); setEmail(e.target.value); }}
                    />
                    <div className={styles.passwordWrap}>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => { setError(""); setPassword(e.target.value); }}
                        />
                        {!isSignup && (
                            <button className={styles.forgotBtn} onClick={handleResetPassword} disabled={loading}>
                                Forgot?
                            </button>
                        )}
                    </div>
                    <button className={styles.submitBtn} onClick={handleEmailAuth} disabled={loading}>
                        {loading ? "Please wait..." : isSignup ? "Sign Up with Email" : "Sign In with Email"}
                    </button>
                </div>

                {resetSent && (
                    <p className={styles.successMsg}>
                        ✓ Password reset sent! Check your email.
                    </p>
                )}

                <p className={styles.toggle}>
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? "Sign In" : "Sign Up"}
                    </span>
                </p>

                {error && <p className={styles.errorMsg}>{error}</p>}
            </div>
        </div>
    );
}

export default LoginPage;
