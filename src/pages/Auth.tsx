import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { KeyRound, LogIn, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Aurora } from "@/components/Aurora";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ACCESS_CODE = "HITSZ2025";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const returnTo = (() => {
    const rt = searchParams.get("returnTo");
    return rt?.startsWith("/") && !rt.startsWith("//") ? rt : "/dashboard";
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed === ACCESS_CODE) {
      sessionStorage.setItem("studybuddy-auth", "1");
      toast.success("Welcome back!", { description: "Access code verified." });
      navigate(returnTo, { replace: true });
    } else {
      setError("Invalid access code. Try HITSZ2025.");
      toast.error("Access denied", {
        description: "That code isn't valid. Hint: it's in the README.",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <Aurora />
      <div className="container flex flex-1 items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="glass glass-deep sheen rounded-2xl p-8 sm:p-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="cursor-pointer transition-transform duration-200 hover:scale-105">
                <BrandMark />
              </div>
              <div>
                <h1 className="tracking-tight font-bold text-2xl text-card-foreground">
                  Unlock Study Buddy
                </h1>
                <p className="mt-2 text-sm text-glass-muted">
                  Enter your access code to find your study partners.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="access-code"
                  className="mb-2 block text-xs font-semibold tracking-wider uppercase text-glass-muted"
                >
                  Access code
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary" />
                  <Input
                    id="access-code"
                    autoFocus
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter access code"
                    className={cn(
                      "glass-hover h-12 rounded-xl bg-transparent pl-10 text-base",
                      error &&
                        "border-destructive/60 focus-visible:ring-destructive/30",
                    )}
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-base font-semibold text-white shadow-xs transition-transform duration-200 hover:scale-[1.02]"
              >
                <LogIn className="size-4" />
                Enter Study Buddy
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-glass-muted">
                <Sparkles className="size-3.5 text-primary" />
                Demo tip: the code is HITSZ2025
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
