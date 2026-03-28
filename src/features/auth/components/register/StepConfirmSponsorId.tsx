import { useState } from "react";
import { Button } from "../../../../components/ui/Button";
import type { SignUpData } from "../../schemas";

export function StepConfirmSponsorId({
  onNext,
  onBack,
}: {
  data: SignUpData;
  onNext: (d: Record<string, never>) => void;
  onBack: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="space-y-5">
      <label className="flex items-center gap-4 p-4 bg-white  rounded-xl cursor-pointer transition-colors border border-white/5">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="w-5 h-5 accent-brand-blue rounded"
        />
        <span className="text-black text-sm font-medium">
          Yes, I confirm this Sponsor ID
        </span>
      </label>
      <div className="flex gap-4 pt-8 mx-auto w-full max-w-[480px]">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!confirmed}
          onClick={() => onNext({})}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
