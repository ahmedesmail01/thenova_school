import {
  createLazyFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState } from "react";
import { Stepper } from "../components/ui/Stepper";
import { useAuthStore } from "../features/auth/useAuthStore";
import type { SignUpData } from "../features/auth/schemas";
import logo from "../../public/images/nova-logo.png";
import { StepSponsorId } from "../features/auth/components/register/StepSponsorId";
import { StepConfirmSponsorId } from "../features/auth/components/register/StepConfirmSponsorId";
import { StepAccountDetails } from "../features/auth/components/register/StepAccountDetails";
import { StepCreatePin } from "../features/auth/components/register/StepCreatePin";
import { StepReview } from "../features/auth/components/register/StepReview";

export const Route = createLazyFileRoute("/register")({
  component: RegisterPage,
});

const STEPS = [
  "Sponsor ID",
  "Confirm Sponsor",
  "Account Details",
  "Create PIN",
  "Review",
];

function RegisterPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/register" }) as {
    sponsorId?: string;
    redirect?: string;
  };
  const redirectParam = search.redirect || "/dashboard";
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [step, setStep] = useState(search.sponsorId ? 1 : 0);
  const [formData, setFormData] = useState<SignUpData>({
    sponsorId: search.sponsorId,
  });

  const next = (data: Partial<SignUpData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  if (isAuthenticated) {
    navigate({ to: redirectParam as any });
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex justify-center px-4 sm:px-6 py-4 sm:py-10 overflow-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/images/register-bg.png")' }}
    >
      <div className="relative z-10 w-full max-w-[1000px] my-auto">
        {/* Card */}
        <div className="rounded-[12px] bg-[#1a2f3f] p-6 sm:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.65)]">
          <div className="flex items-start justify-between mb-4">
            <button
              type="button"
              className="text-white text-2xl leading-none px-1"
              onClick={() => navigate({ to: "/" })}
            >
              ×
            </button>
            <Link to="/">
              <img src={logo} alt="Nova Group" className="h-12 sm:h-16" />
            </Link>
          </div>

          <div className="text-center mb-[66px]">
            <h1 className="text-2xl sm:text-[28px] font-semibold text-white">
              {step === 0 && "Sign Up"}
              {step === 1 && "Confirm Sponsor ID"}
              {step === 2 && "Account Details"}
              {step === 3 && "Create PIN"}
              {step === 4 && "Review and Confirm"}
            </h1>
            <p className="text-[20px] text-white ">
              {step === 0 && "Enter your details to create your member account"}
              {step === 1 &&
                "Are you sure you want to join under the Sponsor ID:" +
                  " " +
                  formData.sponsorId}
              {step === 2 && "Enter your details to create your member account"}
              {step === 3 && "Create your PIN"}
              {step === 4 &&
                "Please review your information before creating your account."}
            </p>
          </div>

          <Stepper steps={STEPS} current={step} />

          <div className="mt-[66px]">
            {step === 0 && <StepSponsorId onNext={next} />}
            {step === 1 && (
              <StepConfirmSponsorId
                data={formData}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 2 && (
              <StepAccountDetails data={formData} onNext={next} onBack={back} />
            )}
            {step === 3 && <StepCreatePin onNext={next} onBack={back} />}
            {step === 4 && (
              <StepReview
                data={formData}
                onBack={back}
                onSuccess={(user) => {
                  setUser(user);
                  navigate({ to: redirectParam as any });
                }}
              />
            )}
          </div>
          <p className="text-center mt-6 text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              search={search.redirect ? { redirect: search.redirect } : undefined}
              className="text-white font-semibold hover:text-brand-blue-light underline underline-offset-2 transition-colors"
            >
              Login →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
