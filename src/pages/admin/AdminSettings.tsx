import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { updateBusinessSettings } from "@/lib/api/business";
import {
  businessSettingsSchema,
  BusinessSettingsFormValues,
} from "@/lib/validation/businessSettingsSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { data: business } = useBusinessSettings();
  const queryClient = useQueryClient();

  const form = useForm<BusinessSettingsFormValues>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      name: "",
      shortName: "",
      tagline: "",
      phone: "",
      phoneHref: "",
      whatsapp: "",
      address: "",
      hours: "",
      mapQuery: "",
    },
  });

  useEffect(() => {
    if (business) form.reset(business);
  }, [business, form]);

  const mutation = useMutation({
    mutationFn: (values: BusinessSettingsFormValues) =>
      updateBusinessSettings({
        name: values.name,
        short_name: values.shortName,
        tagline: values.tagline,
        phone: values.phone,
        phone_href: values.phoneHref,
        whatsapp: values.whatsapp,
        address: values.address,
        hours: values.hours,
        map_query: values.mapQuery,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-settings"] });
      toast({ title: "Business info updated" });
    },
    onError: () => toast({ title: "Something went wrong", variant: "destructive" }),
  });

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl font-bold">Business settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Shown throughout the site — header, footer, and contact page.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="mt-6 space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full business name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short name (used in the logo)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (displayed)</FormLabel>
                  <FormControl>
                    <Input placeholder="+233 24 409 3842" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneHref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone link (tap-to-call)</FormLabel>
                  <FormControl>
                    <Input placeholder="tel:+233244093842" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp link</FormLabel>
                <FormControl>
                  <Input placeholder="https://wa.me/233244093842" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening hours</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mapQuery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Map search text (URL-encoded address)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminSettings;
