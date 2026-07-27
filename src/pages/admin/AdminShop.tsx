import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";
import { upsertCollection, deleteCollection } from "@/lib/api/collections";
import { deleteProduct } from "@/lib/api/products";
import { Collection } from "@/data/products";
import { formatPrice } from "@/data/products";
import { collectionSchema, CollectionFormValues } from "@/lib/validation/collectionSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const CollectionDialog = ({
  collection,
  trigger,
}: {
  collection?: Collection;
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      slug: collection?.slug ?? "",
      name: collection?.name ?? "",
      description: collection?.description ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CollectionFormValues) =>
      upsertCollection({
        id: values.slug,
        slug: values.slug,
        name: values.name,
        description: values.description,
        image: collection?.image ?? "",
        heroImage: collection?.heroImage,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast({ title: collection ? "Collection updated" : "Collection added" });
      setOpen(false);
      form.reset();
    },
    onError: () => toast({ title: "Something went wrong", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{collection ? "Edit collection" : "Add collection"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
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
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (used in the shop URL)</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={Boolean(collection)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const CollectionsTab = () => {
  const { data: collections = [], isLoading } = useCollections();
  const { data: products = [] } = useProducts();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast({ title: "Collection deleted" });
    },
    onError: () => toast({ title: "Something went wrong", variant: "destructive" }),
  });

  return (
    <div>
      <div className="flex justify-end mb-3">
        <CollectionDialog
          trigger={
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add collection
            </Button>
          }
        />
      </div>
      <div className="border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {collections.map((collection) => (
              <TableRow key={collection.slug}>
                <TableCell className="font-medium">{collection.name}</TableCell>
                <TableCell className="max-w-[320px] truncate text-sm text-muted-foreground">
                  {collection.description}
                </TableCell>
                <TableCell>
                  {products.filter((p) => p.collection === collection.id).length}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <CollectionDialog
                      collection={collection}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{collection.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This can't be undone. Products in this collection will need a new
                            collection assigned.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(collection.slug)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const ProductsTab = () => {
  const { data: products = [], isLoading } = useProducts();
  const { data: collections = [] } = useCollections();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted" });
    },
    onError: () => toast({ title: "Something went wrong", variant: "destructive" }),
  });

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button size="sm" asChild>
          <Link to="/admin/shop/products/new">
            <Plus className="w-4 h-4 mr-1" /> Add product
          </Link>
        </Button>
      </div>
      <div className="border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => {
              const collection = collections.find((c) => c.id === product.collection);
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {collection?.name ?? product.collection}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatPrice(product.price)}
                    {product.priceUnit && (
                      <span className="text-xs text-muted-foreground"> {product.priceUnit}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {product.featured && <Badge variant="secondary">Featured</Badge>}
                      {product.new && <Badge>New</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/shop/products/${product.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{product.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(product.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const AdminShop = () => {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Shop</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage collections and the products/rentals/parts listed in each.
      </p>

      <Tabs defaultValue="products" className="mt-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-4">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="collections" className="mt-4">
          <CollectionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminShop;
