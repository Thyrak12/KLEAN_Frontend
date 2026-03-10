import { Link } from "react-router-dom";
import {
  ChefHat,
  BarChart3,
  Calendar,
  Star,
  MessageSquare,
  Utensils,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  Smartphone,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* Navigation */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <ChefHat size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Dine<span className="text-amber-500">Flow</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-amber-500 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* Hero Section */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap size={16} />
              The #1 Restaurant Management Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Manage Your Restaurant
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                Like Never Before
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Streamline operations, boost customer engagement, and grow your
              restaurant business with our all-in-one management platform
              designed exclusively for restaurant owners.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg shadow-amber-400/30 hover:shadow-xl hover:shadow-amber-400/40"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 border-2 border-gray-300 hover:border-amber-400 text-gray-700 hover:text-amber-600 font-semibold px-8 py-4 rounded-full text-lg transition-all"
              >
                Sign In to Dashboard
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="grid grid-cols-4 gap-4">
                  {/* Mini dashboard preview cards */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp size={20} className="text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$12,450</p>
                    <p className="text-xs text-green-600">+23% this month</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Customers</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">1,284</p>
                    <p className="text-xs text-blue-600">+89 new this week</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Star size={20} className="text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Rating</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                    <p className="text-xs text-amber-600">Based on 234 reviews</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar size={20} className="text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Bookings</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">48</p>
                    <p className="text-xs text-purple-600">Today's reservations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* Features Section */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Restaurant
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From menu management to customer feedback, we've got all the tools
              to help your restaurant thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg hover:shadow-amber-100/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Utensils size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Menu Management
              </h3>
              <p className="text-gray-600">
                Create, update, and organize your menu items with beautiful
                images, categories, and pricing. Changes reflect instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg hover:shadow-green-100/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600">
                Track revenue, customer trends, popular dishes, and business
                performance with real-time analytics and insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg hover:shadow-blue-100/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calendar size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Reservation System
              </h3>
              <p className="text-gray-600">
                Manage table bookings, handle walk-ins, and optimize seating
                arrangements to maximize your restaurant capacity.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg hover:shadow-purple-100/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Star size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Promotions & Offers
              </h3>
              <p className="text-gray-600">
                Create attractive promotions, discounts, and special offers to
                attract new customers and reward loyal ones.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100 hover:shadow-lg hover:shadow-rose-100/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageSquare size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Customer Feedback
              </h3>
              <p className="text-gray-600">
                Monitor reviews, respond to customers, and improve your service
                based on real feedback and ratings.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-100 hover:shadow-lg hover:shadow-cyan-100/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Smartphone size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Mobile Friendly
              </h3>
              <p className="text-gray-600">
                Access your dashboard from anywhere. Manage your restaurant on
                the go with our responsive mobile interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* Why Choose Us Section */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Restaurant Owners Choose{" "}
                <span className="text-amber-400">DineFlow</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of restaurant owners who have transformed their
                business operations with our platform.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Save 10+ Hours Weekly</h4>
                    <p className="text-gray-400">
                      Automate repetitive tasks and focus on what matters most - your customers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Increase Revenue by 25%</h4>
                    <p className="text-gray-400">
                      Smart promotions and better customer engagement drive more sales.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Boost Customer Satisfaction</h4>
                    <p className="text-gray-400">
                      Respond to feedback quickly and improve your restaurant's reputation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">24/7 Support</h4>
                    <p className="text-gray-400">
                      Our dedicated support team is always here to help you succeed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <p className="text-4xl font-bold text-amber-400 mb-2">500+</p>
                    <p className="text-gray-300">Restaurants</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <p className="text-4xl font-bold text-amber-400 mb-2">50K+</p>
                    <p className="text-gray-300">Orders/Month</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <p className="text-4xl font-bold text-amber-400 mb-2">98%</p>
                    <p className="text-gray-300">Satisfaction</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <p className="text-4xl font-bold text-amber-400 mb-2">4.9</p>
                    <p className="text-gray-300">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* How It Works Section */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started in 3 Easy Steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Setting up your restaurant on DineFlow takes just minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Create Your Account
              </h3>
              <p className="text-gray-600">
                Sign up with your email and basic restaurant information. It's
                free to get started.
              </p>
              {/* Arrow */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-amber-200">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-t-2 border-amber-400 rotate-45" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Set Up Your Restaurant
              </h3>
              <p className="text-gray-600">
                Add your menu items, set up promotions, and customize your
                restaurant profile.
              </p>
              {/* Arrow */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-amber-200">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-t-2 border-amber-400 rotate-45" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Start Managing & Growing
              </h3>
              <p className="text-gray-600">
                Use the dashboard to manage operations, track performance, and
                grow your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* CTA Section */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-amber-400 to-orange-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join hundreds of successful restaurant owners who trust DineFlow to
            manage their business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-amber-600 font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg transition-all"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* Footer */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <ChefHat size={24} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Dine<span className="text-amber-400">Flow</span>
                </span>
              </div>
              <p className="text-sm">
                The complete restaurant management platform for modern
                restaurant owners.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © 2026 DineFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-amber-400 transition-colors">
                <Shield size={20} />
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                <Clock size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
