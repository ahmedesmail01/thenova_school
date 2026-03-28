import { Link } from "@tanstack/react-router";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-4xl bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-700">
        <h1 className="text-[150px] md:text-[200px] font-black leading-none text-white opacity-5 tracking-tighter">
          404
        </h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Lost in the <span className="text-brand-blue">Galaxy</span>?
          </h2>
          <p className="text-text-secondary text-lg max-w-md mx-auto mb-10">
            The page you're looking for has moved to another dimension or never
            existed.
          </p>
          <Link to="/">
            <Button
              size="lg"
              className="h-14 px-10 shadow-xl shadow-brand-blue/20"
            >
              Return to Nova Base
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
