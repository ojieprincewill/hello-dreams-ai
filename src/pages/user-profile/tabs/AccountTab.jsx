import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../auth/authContext";
import toast from "react-hot-toast";

const AccountTab = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [profileName, setProfileName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (user?.name) setProfileName(user.name);
  }, [user?.name]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setProfileSaving(true);
    try {
      await updateUserProfile({ name: profileName.trim() });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#1c1c1c] p-5 md:p-6">
        <h2 className="text-base md:text-lg font-bold mb-4">Personal information</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-[#667085] dark:text-gray-400 mb-1.5">
              Display name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1342ff]/30 focus:border-[#1342ff] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-[#667085] dark:text-gray-400 mb-1.5">
              Email address
            </label>
            <p className="text-sm font-medium text-[#667085] dark:text-gray-400 py-2.5">
              {user?.email || "—"}
            </p>
            <p className="text-xs text-[#667085] dark:text-gray-500 mt-1">
              Contact support to change your email address.
            </p>
          </div>
          <div className="pt-1">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-5 py-2.5 bg-[#1342ff] text-white rounded-lg text-sm font-semibold disabled:opacity-60 cursor-pointer hover:opacity-90 transition-opacity"
            >
              {profileSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountTab;
