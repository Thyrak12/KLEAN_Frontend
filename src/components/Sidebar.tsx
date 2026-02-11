import { NavLink } from "react-router-dom";
import logo from '../assets/logo.png';

import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  MessageSquareMore,
  CalendarCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Restaurant Profile", icon: Store },
  { to: "/menus", label: "Menu & Promotions", icon: UtensilsCrossed },
  { to: "/feedback", label: "Feedback Monitor", icon: MessageSquareMore },
  { to: "/reservation", label: "Reservation", icon: CalendarCheck },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-white flex flex-col justify-between shadow-lg z-20 overflow-hidden transition-all duration-300 ${
        collapsed ? "w-20" : "w-80"
      }`}
    >
      {/* ── Top section ── */}
      <div>
        {/* Logo + Toggle */}
        <div className="flex flex-col items-center pt-6 pb-4 relative">
          {!collapsed && (
            <img
              src={logo}
              alt="Klean Logo"
              className="w-30 h-30 object-contain mb-2 transition-opacity duration-200"
            />
          )}

          <button
            onClick={onToggle}
            className={`p-2 rounded-lg hover:bg-amber-100 text-gray-500 hover:text-gray-800 transition-colors ${
              collapsed ? "mt-2" : "absolute top-3 right-3"
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={22} />
            ) : (
              <PanelLeftClose size={22} />
            )}
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className={`mt-2 space-y-1 ${collapsed ? "px-2" : "px-4"}`}>
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                [
                  "flex items-center rounded-xl font-medium transition-all duration-200",
                  collapsed
                    ? "justify-center px-0 py-3.5 text-sm"
                    : "gap-4 px-5 py-4 text-base",
                  isActive
                    ? "bg-amber-400 text-white shadow-md"
                    : "!text-gray-500 hover:bg-amber-100 hover:!text-gray-800",
                ].join(" ")
              }
            >
              <Icon size={22} strokeWidth={2} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Decorative wave at bottom ── */}
      <div className="relative w-full h-44 overflow-hidden">
        <svg
          viewBox="0 0 288 180"
          fill="none"
          className="absolute bottom-0 left-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* grey layer */}
          <path
            d="M0 180 L0 120 C40 60, 120 140, 180 100 C220 70, 260 90, 288 80 L288 180 Z"
            fill="#D1D5DB"
          />
          {/* dark-yellow layer */}
          <path
            d="M0 180 L0 140 C50 80, 130 155, 190 115 C230 85, 265 105, 288 95 L288 180 Z"
            fill="#D97706"
          />
          {/* yellow layer */}
          <path
            d="M0 180 L0 155 C60 100, 140 165, 200 130 C240 105, 270 120, 288 112 L288 180 Z"
            fill="#FBBF24"
          />
        </svg>
      </div>
    </aside>
  );
}
