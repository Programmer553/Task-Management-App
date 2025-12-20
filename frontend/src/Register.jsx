import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./apis/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear error on typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await registerUser(formData);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Registration failed" });
    }
  };

  const inputClass =
    "w-full px-5 py-3.5 bg-[#3D4142] rounded-xl text-white text-sm sm:text-base placeholder-[#777979] focus:outline-none focus:ring-2 focus:ring-[#FAC1D9]";

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-6 py-12 font-['Poppins']">
      <div className="w-full max-w-3xl bg-[#292C2D] rounded-[40px] px-10 sm:px-12 md:px-16 py-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-wider text-[#FAC1D9]">
            COSYPOS
          </h1>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-medium text-white mb-2">
            Register
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="flex flex-col items-start">
            <label className="text-white text-sm sm:text-base font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={inputClass}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col items-start">
            <label className="text-white text-sm sm:text-base font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={inputClass}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col items-start">
            <label className="text-white text-sm sm:text-base font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={inputClass}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col items-start">
            <label className="text-white text-sm sm:text-base font-medium mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {errors.role && (
              <p className="text-red-400 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* API Error */}
          {errors.api && (
            <p className="text-red-400 text-sm text-center">{errors.api}</p>
          )}

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="px-14 py-3.5 bg-[#FAC1D9] hover:bg-pink-300 text-[#333333] text-base rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Register
            </button>
          </div>

          <div className="text-center pt-4">
            <p
              className="text-[#FAC1D9] text-sm cursor-pointer"
              onClick={() => navigate("/")}
            >
              Already have an account?
              <span className="text-white underline">Login</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
