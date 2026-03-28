import { useState } from "react";
import { Button } from "../../../../components/ui/Button";

export function StepCreatePin({
  onNext,
  onBack,
}: {
  onNext: (d: { pin: string }) => void;
  onBack: () => void;
}) {
  const [pin, setPin] = useState(["", "", "", ""]);

  const handlePinChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin];
    next[i] = val;
    setPin(next);
    if (val && i < 3) document.getElementById(`reg-pin-${i + 1}`)?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) {
      document.getElementById(`reg-pin-${i - 1}`)?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <p className="text-text-secondary text-sm text-center">
        Create a 4-digit PIN to secure your account
      </p>
      <div className="flex gap-4">
        {pin.map((v, i) => (
          <input
            key={i}
            id={`reg-pin-${i}`}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={v}
            onChange={(e) => handlePinChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-16 h-16 text-center text-3xl font-black rounded-xl bg-white text-gray-900 border-2 border-transparent focus:border-brand-blue outline-none transition-colors shadow-sm"
          />
        ))}
      </div>
      {pin.every(Boolean) && (
        <p className="text-green-400 text-xs font-bold flex items-center gap-1">
          ✓ PIN set successfully
        </p>
      )}
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
          disabled={pin.some((p) => !p)}
          onClick={() => onNext({ pin: pin.join("") })}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
