import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  MailCheck,
  Megaphone,
  MessageSquareText,
  Phone,
  RefreshCw,
  Smartphone,
  Star,
  Store,
  Tags,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Restaurant Profile Management",
      description:
        "Update restaurant details, images, contact information, and opening hours from one dashboard.",
      icon: Store,
      iconWrap: "bg-amber-100 text-amber-700",
      bg: "bg-white",
      border: "border-amber-100",
    },
    {
      title: "Menu Management",
      description:
        "Add, edit, or remove menu items and prices quickly so your listings always stay accurate.",
      icon: UtensilsCrossed,
      iconWrap: "bg-amber-100 text-amber-700",
      bg: "bg-white",
      border: "border-gray-200",
    },
    {
      title: "Promotion Management",
      description:
        "Create and manage special offers, discounts, and campaigns to attract more customers.",
      icon: Megaphone,
      iconWrap: "bg-yellow-100 text-yellow-700",
      bg: "bg-white",
      border: "border-yellow-100",
    },
    {
      title: "Email Trigger Automation",
      description:
        "Automatically send email notifications when a restaurant request is submitted and when the restaurant is approved.",
      icon: MailCheck,
      iconWrap: "bg-amber-100 text-amber-700",
      bg: "bg-white",
      border: "border-gray-200",
    },
    {
      title: "Customer Feedback",
      description:
        "View customer reviews and ratings to understand satisfaction and improve operations.",
      icon: MessageSquareText,
      iconWrap: "bg-amber-100 text-amber-700",
      bg: "bg-white",
      border: "border-amber-100",
    },
    {
      title: "Real-Time Updates",
      description:
        "Every update is synchronized instantly so your customer-facing app always shows the latest information.",
      icon: RefreshCw,
      iconWrap: "bg-yellow-100 text-yellow-700",
      bg: "bg-white",
      border: "border-yellow-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] text-gray-800">
      <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="KLEAN Logo" className="h-14 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-amber-50 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-2xl bg-amber-400 px-5 py-2.5 font-semibold text-white transition hover:bg-amber-500"
            >
              Register Your Restaurant
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="pointer-events-none absolute -left-44 top-0 h-96 w-96 rounded-full bg-orange-100 blur-3xl" />
        <div className="pointer-events-none absolute -right-44 bottom-0 h-96 w-96 rounded-full bg-amber-100 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
              <LayoutDashboard size={16} />
              Restaurant Owner Web Portal
            </div>

            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Manage Your Restaurant Smarter with KLEAN
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              KLEAN helps restaurant owners manage menus, promotions, and
              customer feedback in one centralized platform with real-time updates.
              Run your operations efficiently and keep information synchronized
              across all customer touchpoints.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-500"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 transition hover:border-amber-500 hover:text-amber-700"
              >
                Register Your Restaurant
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-amber-100/40">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Owner Dashboard Snapshot
              </h3>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Live Sync Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 bg-amber-50/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Today's Reservations</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">42</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-amber-50/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Active Promotions</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">7</p>
              </div>
              <div className="col-span-2 rounded-xl border border-gray-200 bg-amber-50/40 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Customer Rating</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-gray-900">
                    <Star size={14} className="fill-amber-400 text-amber-400" /> 4.8
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-2 w-[82%] rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#faf7f2] py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Overview
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              KLEAN is an all-in-one platform where restaurant owners manage
              restaurant information without switching between multiple systems.
              It is built for simplicity, efficiency, and centralized management
              so teams can focus on delivering excellent dining experiences.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Key Features</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Built to simplify daily operations and help owners manage every
              important function in one place.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className={`group rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:shadow-amber-100/60 ${feature.bg} ${feature.border}`}
                >
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconWrap}`}>
                    <Icon size={22} />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#faf7f2] py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">How It Works</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Register restaurant",
              "Set up profile and menu",
              "Publish promotions",
              "Monitor customer reviews",
            ].map((step, idx) => (
              <div key={step} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                    {idx + 1}
                  </span>
                  {idx !== 3 && <ChevronRight size={18} className="hidden text-gray-300 xl:block" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Benefits</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[
              "Easy to use",
              "Centralized system",
              "Real-time data updates",
              "Better customer reach",
              "Improved business management",
            ].map((benefit) => (
              <div key={benefit} className="rounded-xl border border-gray-200 bg-amber-50/40 p-4">
                <div className="mb-2 inline-flex rounded-lg bg-emerald-100 p-1.5 text-emerald-700">
                  <CheckCircle2 size={16} />
                </div>
                <p className="font-medium text-gray-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-amber-200 bg-gradient-to-r from-[#D97706] to-[#F5A623] py-20 text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">System Integration</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-orange-50/90">
              KLEAN is directly connected to the customer mobile application.
              Every update made by restaurant owners—whether menus, promotions,
              availability, or profile details—is instantly reflected in the
              user app for a seamless and reliable customer experience.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <Smartphone className="mt-0.5 text-yellow-100" size={18} />
                <p className="text-orange-50/90">Instant data sync between owner portal and customer app.</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 text-yellow-100" size={18} />
                <p className="text-orange-50/90">Reduced delays and fewer manual updates.</p>
              </div>
              <div className="flex items-start gap-3">
                <Tags className="mt-0.5 text-yellow-100" size={18} />
                <p className="text-orange-50/90">Promotions and offers become visible to customers in real time.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-300/40 bg-white/10 p-6 backdrop-blur-sm">
            <div className="space-y-3 rounded-xl border border-amber-300/40 bg-white/5 p-5">
              <p className="text-sm font-semibold text-yellow-100">Integration Flow</p>
              <div className="space-y-2 text-sm text-orange-50/90">
                <p className="flex items-center gap-2"><Store size={14} />Owner updates menu and profile</p>
                <p className="flex items-center gap-2"><RefreshCw size={14} />Platform synchronizes data instantly</p>
                <p className="flex items-center gap-2"><Smartphone size={14} />Customer app displays latest changes</p>
                <p className="flex items-center gap-2"><Star size={14} />Users discover accurate restaurant info</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto w-full max-w-5xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Call to Action</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Start Growing Your Restaurant Today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Join KLEAN and run your restaurant with better control, better visibility,
            and better customer engagement.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-7 py-3.5 font-semibold text-white transition hover:bg-amber-500"
            >
              Register Now
              <ArrowRight size={18} />
            </Link>
            <a
              href="mailto:contact@klean.app"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 px-7 py-3.5 font-semibold text-gray-700 transition hover:border-amber-500 hover:text-amber-700"
            >
              Contact Us
              <Phone size={18} />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-[#faf7f2] py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-gray-500 md:flex-row">
          <p>© 2026 KLEAN – Restaurant Discovery Platform</p>
          <p className="inline-flex items-center gap-2">
            <LayoutDashboard size={14} /> Centralized management for modern restaurant owners
          </p>
        </div>
      </footer>
    </div>
  );
}
