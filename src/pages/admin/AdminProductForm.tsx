import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";
import { upsertProduct } from "@/lib/api/products";
import { uploadImage } from "@/lib/api/storage";
import { productSchema, ProductFormValues } from "@/lib/validation/productSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: products = [] } = useProducts();
  const { data: collections = [] } = useCollections();
  const existing = isEdit ? products.find((p) => p.id === id) : undefined;

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: "",
      slug: "",
      collection: "",
      name: "",
      price: 0,
      priceUnit: "",
      description: "",
      longDescription: "",
      materials: "",
      dimensions: "",
      featured: false,
      new: false,
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        id: existing.id,
        slug: existing.slug,
        collection: existing.collection,
        name: existing.name,
        price: existing.price,
        priceUnit: existing.priceUnit ?? "",
        description: existing.description,
        longDescription: existing.longDescription,
        materials: existing.materials,
        dimensions: existing.dimensions ?? "",
        featured: Boolean(existing.featured),
        new: Boolean(existing.new),
      });
      setImages(existing.images ?? []);
    }
  }, [existing, form]);

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) =>
      upsertProduct({
        id: values.id,
        slug: values.slug,
        collection: values.collection,
        name: values.name,
        price: values.price,
        priceUnit: values.priceUnit || undefined,
        description: values.description,
        longDescription: values.longDescription,
        materials: values.materials,
        dimensions: values.dimensions || undefined,
        images,
        featured: values.featured,
        new: values.new,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: isEdit ? "Product updated" : "Product added" });
      navigate("/admin/shop");
    },
    onError: () => toast({ title: "Something went wrong", variant: "destructive" }),
  });

  const handleSubmit = (values: ProductFormValues) => {
    if (images.length === 0) {
      setImagesError("Add at least one photo");
      return;
    }
    setImagesError(null);
    mutation.mutate(values);
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "products");
      setImages((prev) => [...prev, url]);
      setImagesError(null);
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl">
      <Link
        to="/admin/shop"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </Link>

      <h1 className="mt-4 font-serif text-2xl font-bold">
        {isEdit ? "Edit product" : "Add product"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (used in URL)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="collection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a collection" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {collections.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (GH₵)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price unit (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. per day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short description (shown on cards)</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full description</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details (fuel, size, etc.)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Photos</FormLabel>
            <div className="mt-2 flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={url + i} className="relative w-20 h-20 border border-border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
                    aria-label="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-foreground transition"
              >
                <Upload className="w-5 h-5" />
                <span className="text-[10px]">{uploading ? "..." : "Add"}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelected}
              />
            </div>
            {imagesError && <p className="mt-2 text-sm text-destructive">{imagesError}</p>}
          </div>

          <div className="flex gap-8">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Featured on homepage</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Mark as new</FormLabel>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? "Saving..." : isEdit ? "Save changes" : "Add product"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminProductForm;
