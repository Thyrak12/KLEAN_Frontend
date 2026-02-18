
import loginBg from "../assets/login/SignUpBg.png";
import LoginForm from "../components/loginForm";

export default function Login() {
  

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#faf7f2]">
      {/* Yellow decorative blob - left side */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-1/4 z-0">
        <svg
          viewBox="0 0 400 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H200C200 0 400 150 350 350C300 550 400 650 300 900H0V0Z"
            fill="#F5A623"
          />
        </svg>
      </div>

      {/* Food images - right side */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-full z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to left, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, black 10%, transparent 100%)",
        }}
      />

      {/* Login form */}
      <LoginForm />
      
    </div>
  );
}
