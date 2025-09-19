"use client";
import React, { useState } from "react";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (mode === "signin") {
      const { error } = await signInWithEmail(email, password);
      if (error) setError(error.message);
      else {
        setSuccess("Signed in successfully!");
        onClose();
      }
    } else {
      const { error } = await signUpWithEmail(email, password);
      if (error) setError(error.message);
      else setSuccess("Check your email for a confirmation link!");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>&times;</button>
        <h2>{mode === "signin" ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="auth-switch">
          {mode === "signin" ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => setMode("signup")}>Sign Up</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode("signin")}>Sign In</button>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .auth-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.35);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-modal {
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 40px rgba(0,0,0,0.15);
          padding: 2.5rem 2rem 2rem 2rem;
          min-width: 320px;
          max-width: 90vw;
          position: relative;
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 2rem;
          color: #d4a03a;
          cursor: pointer;
        }
        h2 {
          margin-bottom: 1.5rem;
          text-align: center;
          font-family: 'Saturday', cursive;
          background: linear-gradient(135deg, #f7c848 0%, #d4a03a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        input {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #eee;
          font-size: 1rem;
          outline: none;
          background: #faf8f3;
        }
        button[type="submit"] {
          background: linear-gradient(135deg, #f7c848 0%, #d4a03a 100%);
          color: #fff;
          border: none;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.2s;
        }
        button[type="submit"]:hover {
          background: linear-gradient(135deg, #d4a03a 0%, #f7c848 100%);
        }
        .auth-error {
          color: #f44336;
          font-size: 0.95rem;
          text-align: center;
        }
        .auth-success {
          color: #388e3c;
          font-size: 0.95rem;
          text-align: center;
        }
        .auth-switch {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.98rem;
        }
        .auth-switch button {
          background: none;
          border: none;
          color: #d4a03a;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
