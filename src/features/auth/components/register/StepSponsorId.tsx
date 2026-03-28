import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import api from "../../../../lib/api";
import { type SponsorIdSchema, sponsorIdSchema } from "../../schemas";

export function StepSponsorId({
  onNext,
}: {
  onNext: (d: SponsorIdSchema) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SponsorIdSchema>({
    resolver: zodResolver(sponsorIdSchema),
  });

  const { mutate: validateSponsor, isPending } = useMutation({
    mutationFn: (sponsorId: string) => api.get(`/sponsor-data/${sponsorId}`),
    onSuccess: (response, sponsorId) => {
      const data = response.data;
      if (data?.status) {
        setServerError(null);
        onNext({ sponsorId });
      } else if (data?.message) {
        const msgField = data.message as
          | string
          | {
              sponsor_id?: string[];
            };
        const msg =
          typeof msgField === "string" ? msgField : msgField.sponsor_id?.[0];
        setServerError(msg || "Registration failed , incorrect sponsor id");
      } else {
        setServerError("Registration failed , incorrect sponsor id");
      }
    },
    onError: (error: unknown) => {
      const maybeAxiosError = error as {
        response?: { data?: { message?: string | { sponsor_id?: string[] } } };
      };
      const message = maybeAxiosError.response?.data?.message;
      const msg =
        typeof message === "string" ? message : message?.sponsor_id?.[0];
      setServerError(msg || "Registration failed , incorrect sponsor id");
    },
  });

  const onSubmit = (values: SponsorIdSchema) => {
    setServerError(null);
    validateSponsor(values.sponsorId);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Sponsor ID *"
        placeholder="Enter your Sponsor ID"
        error={errors.sponsorId?.message}
        {...register("sponsorId")}
      />
      {serverError && <p className="text-xs text-red-400">{serverError}</p>}
      <p className="text-text-muted text-xs">
        Enter the Sponsor ID of the person who referred you.
      </p>
      <div className="flex gap-4 pt-8 mx-auto w-full max-w-[480px]">
        <Button type="button" variant="outline" className="flex-1" disabled>
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Checking..." : "Next →"}
        </Button>
      </div>
    </form>
  );
}
