import React, { useState } from "react";
import Eye from "./assets/eye.svg";
import EyeOff from "./assets/eye-off.svg";
import Check from "./assets/check.svg";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./apis/auth";
import { jwtDecode } from "jwt-decode"; // ✅ ADD

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotUser, setForgotUser] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const validateUsername = (value) => {
    if (!value.trim()) {
      return "Username is required";
    }
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Username or email is required";
    }
    if (value.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    } else if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    return "";
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let error = "";
    switch (field) {
      case "username":
        error = validateUsername(username);
        break;
      case "password":
        error = validatePassword(password);
        break;
      case "forgotUser":
        error = validateEmail(forgotUser);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (touched.username) {
      setErrors((prev) => ({ ...prev, username: validateUsername(value) }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleForgotUserChange = (e) => {
    const value = e.target.value;
    setForgotUser(value);
    if (touched.forgotUser) {
      setErrors((prev) => ({ ...prev, forgotUser: validateEmail(value) }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    setErrors({ username: usernameError, password: passwordError });
    setTouched({ username: true, password: true });

    if (usernameError || passwordError) return;

    try {
      const res = await loginUser({
        email: username,
        password: password,
      });

      const token = res.data.token;
      const decoded = jwtDecode(token);

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setErrors({ api: "Invalid username or password" });
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();

    const forgotUserError = validateEmail(forgotUser);

    setErrors({ forgotUser: forgotUserError });
    setTouched({ forgotUser: true });

    if (!forgotUserError) {
      alert("Password reset link sent!");
      setMode("login");
      setForgotUser("");
      setErrors({});
      setTouched({});
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrors({});
    setTouched({});
  };

  const inputBaseClass =
    "w-full px-5 py-3.5 bg-[#3D4142] rounded-xl text-white text-sm sm:text-base placeholder-[#777979] focus:outline-none focus:ring-2";

  const getInputClass = (field) => {
    const hasError = touched[field] && errors[field];
    return `${inputBaseClass} ${
      hasError
        ? "ring-2 ring-red-400 focus:ring-red-400"
        : "focus:ring-[#FAC1D9]"
    }`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] flex flex-col items-center justify-center px-6 py-12 font-['Poppins']">
      <div className="mb-8">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-wider text-[#FAC1D9]">
          COSYPOS
        </h1>
      </div>

      <div className="w-full max-w-2xl bg-[#292C2D] rounded-[40px] px-10 sm:px-12 md:px-16 py-8 sm:py-10 shadow-2xl">
        {mode === "login" ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-4xl sm:text-5xl font-medium text-white mb-2">
                Login!
              </h2>
              <p className="text-white text-sm sm:text-base font-normal">
                Please enter your credentials below to continue
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6" noValidate>
              <div>
                <label className="block text-white text-sm sm:text-base font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  onBlur={() => handleBlur("username")}
                  placeholder="Enter your username"
                  className={getInputClass("username")}
                  aria-invalid={touched.username && !!errors.username}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                />
                {touched.username && errors.username && (
                  <p id="username-error" className="mt-2 text-red-400 text-sm">
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm sm:text-base font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter your password"
                    className={`${getInputClass("password")} pr-12 `}
                    aria-invalid={touched.password && !!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <img
                    src={showPassword ? EyeOff : Eye}
                    alt="toggle password"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer opacity-80 hover:opacity-100"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {errors.api && (
                  <p className="text-red-500 text-center pt-4">
                    Invalid username or password
                  </p>
                )}
                {touched.password && errors.password && (
                  <p id="password-error" className="mt-2 text-red-400 text-sm">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label
                  htmlFor="remember"
                  className="flex items-center cursor-pointer"
                >
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`w-5 h-5 border-2 border-[#FAC1D9] rounded-sm bg-black flex items-center justify-center mr-3 transition-all ${
                      rememberMe ? "bg-[#FAC1D9]" : ""
                    }`}
                  >
                    <img
                      src={Check}
                      alt="checked"
                      className={`w-4 h-4 ${
                        rememberMe ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </span>
                  <span className="text-[#FAC1D9] text-sm sm:text-base">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => handleModeSwitch("forgot")}
                  className="text-[#FAC1D9] text-sm sm:text-base underline hover:text-pink-300 cursor-pointer"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-[#FAC1D9] text-sm sm:text-base underline hover:text-pink-300 cursor-pointer"
                >
                  Register?
                </button>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="px-12 py-3.5 bg-[#FAC1D9] hover:bg-pink-300 text-[#333333] text-base rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-4xl sm:text-3xl font-medium text-white mb-2">
                Forgot your password?
              </h2>
              <p className="text-white text-sm sm:text-base max-w-[60%] mx-auto">
                Please enter your username or email to recover your password
              </p>
            </div>

            <form
              onSubmit={handleForgotSubmit}
              className="space-y-6"
              noValidate
            >
              <div>
                <label className="block text-white text-sm sm:text-base font-medium mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={forgotUser}
                  onChange={handleForgotUserChange}
                  onBlur={() => handleBlur("forgotUser")}
                  placeholder="Enter your username or email"
                  className={getInputClass("forgotUser")}
                  aria-invalid={touched.forgotUser && !!errors.forgotUser}
                  aria-describedby={
                    errors.forgotUser ? "forgot-error" : undefined
                  }
                />
                {touched.forgotUser && errors.forgotUser && (
                  <p id="forgot-error" className="mt-2 text-red-400 text-sm">
                    {errors.forgotUser}
                  </p>
                )}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#FAC1D9] hover:bg-pink-300 text-[#333333] text-sm rounded-md shadow-lg transition-colors"
                >
                  Submit Now
                </button>
              </div>

              <div className="text-center pt-6">
                <button
                  type="button"
                  onClick={() => handleModeSwitch("login")}
                  className="text-[#FAC1D9] text-sm underline hover:text-pink-300"
                >
                  Back to Login!
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
