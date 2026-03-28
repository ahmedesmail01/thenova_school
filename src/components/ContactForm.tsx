import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    console.log("Form Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Form submitted successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md p-4 border rounded-lg shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register("name")}
          className="w-full p-2 border rounded mt-1"
          placeholder="John Doe"
        />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register("email")}
          className="w-full p-2 border rounded mt-1"
          placeholder="john@example.com"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea
          {...register("message")}
          className="w-full p-2 border rounded mt-1"
          rows={4}
          placeholder="Your message here..."
        />
        {errors.message && (
          <span className="text-red-500 text-xs">{errors.message.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
