import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { useInternalTransfer } from "../useWalletTotals";
import toast from "react-hot-toast";

interface TransactionFormData {
  recipient_member_code: string;
  amount: number;
}

export function TransactionsForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pendingData, setPendingData] = useState<TransactionFormData | null>(
    null,
  );

  const transferMutation = useInternalTransfer();

  const onSubmit = (data: TransactionFormData) => {
    setPendingData(data);
    setIsPinModalOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!pin) {
      toast.error("Please enter your PIN");
      return;
    }

    if (pendingData) {
      transferMutation.mutate(
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
    <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 p-6">
      <h3 className="font-semibold text-sm text-slate-800 mb-6">
        Transactions
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wider z-10 transition-all">
            Receiver Member ID
          </label>
          <input
            type="text"
            placeholder="Receiver Member ID"
            {...register("recipient_member_code", {
              required: "Member ID is required",
            })}
            className="w-full border text-black border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
          />
          {errors.recipient_member_code && (
            <span className="text-[10px] text-red-500 ml-1">
              {errors.recipient_member_code.message}
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
          disabled={transferMutation.isPending}
          className="w-full bg-[#1e3a5f] hover:bg-[#152e4d] text-white font-medium py-3 rounded-lg transition-all shadow-md active:scale-[0.98] text-sm mt-2 disabled:opacity-50"
        >
          {transferMutation.isPending ? "Sending..." : "Send"}
        </button>
      </form>

      {/* PIN Confirmation Modal */}
      <Modal open={isPinModalOpen} onClose={() => setIsPinModalOpen(false)}>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Confirm PIN Code</h3>
            <p className="text-slate-400">
              Please enter your PIN code to confirm this transfer.
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
                disabled={transferMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmTransfer}
                disabled={transferMutation.isPending}
              >
                {transferMutation.isPending ? "Confirming..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
