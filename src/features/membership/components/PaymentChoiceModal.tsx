import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";

interface PaymentChoiceModalProps {
  open: boolean;
  onClose: () => void;
  onPaymentChoice: (payBy: "token" | "stripe") => void;
  isSubscribing: boolean;
}

export function PaymentChoiceModal({
  open,
  onClose,
  onPaymentChoice,
  isSubscribing,
}: PaymentChoiceModalProps) {
  return (
    <Modal
      open={open}
      onClose={() => !isSubscribing && onClose()}
      className="max-w-md bg-white! p-6!"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Choose Payment Method
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Select how you would like to pay for your subscription
          </p>
        </div>

        <div className="grid gap-4">
          <button
            disabled={isSubscribing}
            onClick={() => onPaymentChoice("token")}
            className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 hover:border-brand-blue rounded-xl transition-all group disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 7h-8" />
                  <path d="M7 21v-4" />
                  <path d="M15 3v4" />
                  <path d="M19 17v4" />
                  <path d="M3 7h2" />
                  <path d="M15 21v-4" />
                  <path d="M19 3v4" />
                  <path d="M3 17h2" />
                  <path d="M21 7v10" />
                  <path d="M11 21v-4" />
                  <path d="M3 7v10" />
                  <path d="M7 3v4" />
                  <path d="M11 3v4" />
                  <path d="M21 7h-2" />
                  <path d="M21 17h-2" />
                  <path d="M7 21h10" />
                  <path d="M7 3h10" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">Token Wallet</p>
                <p className="text-xs text-slate-500">
                  Pay using your available tokens
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <button
            disabled={isSubscribing}
            onClick={() => onPaymentChoice("stripe")}
            className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 hover:border-brand-blue rounded-xl transition-all group disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">Stripe</p>
                <p className="text-xs text-slate-500">
                  Credit card or other Stripe methods
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <Button
          variant="ghost"
          className="w-full text-slate-400 hover:text-slate-600"
          onClick={onClose}
          disabled={isSubscribing}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
