import { NavLink } from "react-router-dom";
import logo from '../assets/logo.png';

import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  MessageSquareMore,
  CalendarCheck,
} from "lucide-react";

const menuItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Restaurant Profile", icon: Store },
  { to: "/menus", label: "Menu & Promotions", icon: UtensilsCrossed },
  { to: "/feedback", label: "Feedback Monitor", icon: MessageSquareMore },
  { to: "/reservation", label: "Reservation", icon: CalendarCheck },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white flex flex-col justify-between shadow-lg z-20 overflow-hidden">
      {/* ── Logo ── */}
      <div>
        <div className="flex flex-col items-center pt-6 pb-4">
          <img src={logo} alt="Klean Logo" className="w-30 h-30 object-contain mb-2" />
        </div>

        {/* ── Navigation ── */}
        <nav className="px-4 mt-2 space-y-1">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-4 px-5 py-4 rounded-xl text-base font-medium transition-colors",
                  isActive
                    ? "bg-amber-400 text-white shadow-md"
                    : "!text-gray-500 hover:bg-amber-100 hover:!text-gray-800",
                ].join(" ")
              }
            >
              <Icon size={22} strokeWidth={2} />
              <span>{label}</span>
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
