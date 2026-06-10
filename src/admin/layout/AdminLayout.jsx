import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Cpu,
  Shield,
  ScrollText,
  Menu,
  X,
} from "lucide-react";
import AdminSelectableNavItem from "../components/primitives/AdminSelectableNavItem";
import AdminButton from "../components/primitives/AdminButton";
import UserIconDropdown from "../../components/user-icon-dropdown/user-icon-dropdown.component";
import { useAuth } from "../../auth/authContext";
import { isSuperuser } from "../../auth/roleUtils";

const NAV_ITEMS = [
  { to: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { to: "/admin/costs", label: "AI Costs", icon: Cpu },
  { to: "/admin/admins", label: "Admins", icon: Shield, superuserOnly: true },
  { to: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
];

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter(
    (item) => !item.superuserOnly || isSuperuser(user),
  );

  const sidebar = (
    <div className="flex flex-col h-full p-4">
      <Link to="/" className="mb-6 px-2">
        <img
          src="https://res.cloudinary.com/dganx8kmn/image/upload/v1759449140/Hello%20dreams%20%20AI/26d3a9db798a4cc8725cb83dcbf5cf7966ae74dc_jifjis.png"
          alt="Hello Dreams AI"
          className="h-8 w-8 object-contain"
        />
      </Link>
      <p
        className="text-[12px] uppercase tracking-wider text-[#667085] dark:text-[#aaa] px-2 mb-3"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        Admin Panel
      </p>
      <nav className="space-y-2 flex-1">
        {visibleNav.map((item) => (
          <AdminSelectableNavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            isActive={location.pathname.startsWith(item.to)}
          />
        ))}
      </nav>
    </div>
  );

  return (
    <div
      className="bg-white text-[#010413] dark:bg-[#212121] dark:text-white min-h-screen transition-colors ease-in-out"
      style={{ fontFamily: "Darker Grotesque, sans-serif" }}
    >
      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-[#f9f9f9] dark:bg-[#181818] border-r border-[#eaecf0] dark:border-[#2d2d2d]">
            <button
              type="button"
              className="absolute top-4 right-4 p-1"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block fixed top-0 left-0 h-screen w-[25%] overflow-auto sidebar border-r-2 border-r-[#eaecf0] dark:border-r-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#181818] z-40">
          {sidebar}
        </div>

        {/* Main content */}
        <div className="w-full lg:w-[75%] lg:ml-[25%] min-h-screen flex flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-4 border-b border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md border border-[#eaecf0] dark:border-[#2d2d2d]"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/ai-dashboard">
                <AdminButton variant="secondary" className="text-[12px] py-1.5 px-3">
                  ← Back to App
                </AdminButton>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <UserIconDropdown />
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8 custom-scrollbar overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
