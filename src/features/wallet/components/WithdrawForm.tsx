import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { useWithdraw } from "../useWalletTotals";
import toast from "react-hot-toast";

interface WithdrawFormData {
  address: string;
  amount: number;
  network: string;
}

export function WithdrawForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawFormData>({
    defaultValues: {
      network: "Erc20",
    },
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pendingData, setPendingData] = useState<WithdrawFormData | null>(null);

  const withdrawMutation = useWithdraw();

  const onSubmit = (data: WithdrawFormData) => {
    setPendingData(data);
    setIsPinModalOpen(true);
  };

  const handleConfirmWithdraw = () => {
    if (!pin) {
      toast.error("Please enter your PIN");
      return;
    }

    if (pendingData) {
      withdrawMutation.mutate(
        { ...pendingData, pin },
        {
          onSuccess: () => {
            reset();
            setPin("");
            setIsPinModalOpen(false);
            setPendingData(null);
          },
        },
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 p-6 flex flex-col gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="font-semibold text-sm text-slate-800 mb-6">Network</h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                value="Erc20"
                {...register("network")}
                className="hidden peer"
              />
              <div className="w-5 h-5 rounded-full border-2  border-slate-300 flex items-center justify-center peer-checked:border-brand-blue peer-checked:bg-brand-terquaz/80 transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-blue opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-slate-800 font-medium">Erc20</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                value="Trc20"
                {...register("network")}
                className="hidden peer"
              />
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center peer-checked:border-brand-blue peer-checked:bg-brand-terquaz/80 transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-blue opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-slate-800 font-medium">Trc20</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-slate-800 mb-2">
            Withdraw
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wider z-10 transition-all">
                Address
              </label>
              <input
                type="text"
                placeholder="Address ..."
                {...register("address", { required: "Address is required" })}
                className="w-full border text-black border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
              />
              {errors.address && (
                <span className="text-[10px] text-red-500 ml-1">
                  {errors.address.message}
                </span>
              )}
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wider z-10 transition-all">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
                placeholder="Amount ..."
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Minimal amount is 0.01" },
                  valueAsNumber: true,
                })}
                className="w-full border text-black border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
              />
              {errors.amount && (
                <span className="text-[10px] text-red-500 ml-1">
                  {errors.amount.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={withdrawMutation.isPending}
              className="w-full bg-[#1e3a5f] hover:bg-[#152e4d] text-white font-medium py-3 rounded-lg transition-all shadow-md active:scale-[0.98] text-sm mt-4 disabled:opacity-50"
            >
              {withdrawMutation.isPending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </form>

      {/* PIN Confirmation Modal */}
      <Modal open={isPinModalOpen} onClose={() => setIsPinModalOpen(false)}>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Confirm PIN Code</h3>
            <p className="text-slate-400">
              Please enter your PIN code to confirm this withdrawal.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="PIN"
              maxLength={4}
              autoComplete="new-password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-transparent border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-brand-blue transition-all text-center tracking-[1em] text-xl font-bold font-mono"
            />

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsPinModalOpen(false)}
                disabled={withdrawMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmWithdraw}
                disabled={withdrawMutation.isPending}
              >
                {withdrawMutation.isPending ? "Confirming..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
