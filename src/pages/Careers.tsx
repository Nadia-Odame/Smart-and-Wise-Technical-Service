import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Send, Upload, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCareerCategories } from "@/hooks/useCareerCategories";
import { uploadCv } from "@/lib/api/cvStorage";
import { submitApplication } from "@/lib/api/jobApplications";
import {
  jobApplicationSchema,
  JobApplicationFormValues,
  validateCvFile,
} from "@/lib/validation/jobApplicationSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const Careers = () => {
  const { data: categories = [] } = useCareerCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  const form = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: { categorySlug: "", fullName: "", email: "", phone: "", coverMessage: "" },
  });

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateCvFile(file);
    if (error) {
      setCvError(error);
      setCvFile(null);
      return;
    }
    setCvError(null);
    setCvFile(file);
  };

  const mutation = useMutation({
    mutationFn: async (values: JobApplicationFormValues) => {
      if (!cvFile) {
        throw new Error("Please attach your CV.");
      }
      const cvPath = await uploadCv(cvFile, values.categorySlug);
      await submitApplication({
        categorySlug: values.categorySlug,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        coverMessage: values.coverMessage || null,
        cvPath,
      });
    },
    onSuccess: () => {
      toast({ title: "Application received", description: "Thank you — we'll be in touch." });
      form.reset();
      setCvFile(null);
      setCvError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  return (
    <Layout>
      <section className="bg-foreground text-background py-14 sm:py-20">
        <div className="container-full">
          <p className="section-label text-primary">Join our team</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-bold">Careers</h1>
          <p className="mt-4 max-w-2xl text-background/75 leading-relaxed">
            We're always looking for skilled, motivated, and dedicated individuals to join 
            Smart & Wise Technical Service Limited. If you're passionate about delivering 
            quality technical services and growing your career in the power solutions industry, 
            we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="container-full py-14 sm:py-20">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold">Opportunities</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.slug}
              className="border border-border bg-card p-6 border-t-4 border-t-primary flex flex-col"
            >
              <h3 className="font-serif text-xl">{category.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                {category.description}
              </p>
              <a
                href="#apply"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase text-foreground link-underline"
              >
                Apply now
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="apply" className="border-t border-border bg-muted py-14 sm:py-20 scroll-mt-24">
        <div className="container-full max-w-2xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">Apply Now</h2>
          <p className="mt-3 text-muted-foreground">
            Fill this in and attach your CV — we'll get back to you.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
              className="mt-6 space-y-5 border border-border bg-card p-6"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Kwame Mensah" className="rounded-none h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="e.g. kwame@example.com"
                          className="rounded-none h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          {...field}
                          placeholder="e.g. 024 000 0000"
                          className="rounded-none h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categorySlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Which opportunity? *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-none h-12">
                          <SelectValue placeholder="Choose one" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Tell us a bit about yourself and your experience."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label className="text-sm font-medium">CV *</label>
                <div className="mt-2 flex items-center gap-3">
                  {cvFile ? (
                    <div className="flex items-center gap-2 text-sm border border-border px-3 py-2 flex-1 min-w-0">
                      <span className="truncate">{cvFile.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCvFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="ml-auto shrink-0 text-muted-foreground hover:text-destructive"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 border-2 border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-foreground transition"
                    >
                      <Upload className="w-4 h-4" />
                      Upload PDF, DOC, or DOCX
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileSelected}
                  />
                </div>
                {cvError && <p className="mt-2 text-sm text-destructive">{cvError}</p>}
              </div>

              {mutation.isError && (
                <p className="text-sm text-destructive">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "Something went wrong sending your application. Please try again."}
                </p>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:brightness-95 transition disabled:opacity-60"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                {mutation.isPending ? "Sending..." : "Send application"}
              </button>
            </form>
          </Form>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
