import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../api/authService";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }
    try {
      setLoading(true);
      await resetPassword(token, password);
      toast.success("Password updated. You can sign in now.");
      navigate("/signin");
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-[#212121]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6 border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl"
      >
        <h1 className="text-2xl font-bold">Reset password</h1>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg dark:bg-[#1c1c1c]"
          required
          minLength={8}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg dark:bg-[#1c1c1c]"
          required
          minLength={8}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#1342ff] text-white rounded-lg cursor-pointer disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
        <Link to="/signin" className="block text-center text-sm text-[#1342ff]">
          Back to sign in
        </Link>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
