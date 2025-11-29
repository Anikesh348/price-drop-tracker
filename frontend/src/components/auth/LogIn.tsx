import React, { useEffect, useState } from "react";
import { useApiFetcher } from "../../hooks/useApiFetcher";
import { AuthService } from "../../apis/auth/auth";
import { Loader } from "../Loader";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const LogIn = () => {
  const { loading, data, error, fetchData } = useApiFetcher();
  const { login, isAuthenticated } = useAuth();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const loadGoogleScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.getElementById("google-login-script")) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.id = "google-login-script";
        script.onload = () => resolve();
        script.onerror = () => reject("Google script failed to load");
        document.body.appendChild(script);
      });
    };

    loadGoogleScript()
      .then(() => {
        if (!isAuthenticated && window.google && GOOGLE_CLIENT_ID) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });

          window.google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            { theme: "outline", size: "large" }
          );
        }
      })
      .catch((err) => console.error(err));
  }, [GOOGLE_CLIENT_ID]);

  const handleCredentialResponse = (response: any) => {
    const idToken = response.credential;
    const { url, options } = AuthService.googleLogin(idToken);
    fetchData(url, options);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { url, options } = AuthService.baseLogin(email, password);
    fetchData(url, options);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (data && data.status === 200 && data.body?.token) {
      login(data.body.token, data.body.user);
      navigate("/");
    }
  }, [data, error, login, navigate]);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen w-full landing-bg transition-colors duration-300">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="glass-card border border-gray-200 dark:border-gray-700 rounded-3xl p-8 w-full max-w-md mx-4 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Log in to access ToolHub
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={(event) => setemail(event.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                isFormValid && !loading
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg active:scale-95"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center" }}
            id="google-signin-button"
            className="mb-6"
          ></div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
