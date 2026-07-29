import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useCareerCategories } from "@/hooks/useCareerCategories";
import { upsertCareerCategory, deleteCareerCategory, CareerCategory } from "@/lib/api/careers";
import {
  fetchApplications,
  updateApplicationStatus,
  ApplicationStatus,
  JobApplication,
} from "@/lib/api/jobApplications";
import { getCvSignedUrl } from "@/lib/api/cvStorage";
import {
  careerCategorySchema,
  CareerCategoryFormValues,
} from "@/lib/validation/careerCategorySchema";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const STATUS_TABS: { value: "all" | ApplicationStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
];

const STATUS_BADGE: Record<ApplicationStatus, "default" | "secondary" | "outline"> = {
  new: "default",
  reviewed: "secondary",
  shortlisted: "secondary",
  rejected: "outline",
  hired: "outline",
};

const CareerCategoryDialog = ({
  category,
  trigger,
}: {
  category?: CareerCategory;
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<CareerCategoryFormValues>({
    resolver: zodResolver(careerCategorySchema),
    defaultValues: {
      slug: category?.slug ?? "",
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CareerCategoryFormValues) =>
      upsertCareerCategory({
        slug: values.slug,
        name: values.name,
        description: values.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-categories"] });
      toast({ title: category ? "Category updated" : "Category added" });
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
          <DialogTitle>{category ? "Edit category" : "Add category"}</DialogTitle>
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
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={Boolean(category)} />
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

const CategoriesTab = () => {
  const { data: categories = [], isLoading } = useCareerCategories();
  const { data: applications = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => fetchApplications(),
  });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCareerCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-categories"] });
      toast({ title: "Category deleted" });
    },
    onError: () => toast({ title: "Something went wrong", variant: "destructive" }),
  });

  return (
    <div>
      <div className="flex justify-end mb-3">
        <CareerCategoryDialog
          trigger={
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add category
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
              <TableHead>Applications</TableHead>
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
            {categories.map((category) => (
              <TableRow key={category.slug}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-[320px] truncate text-sm text-muted-foreground">
                  {category.description}
                </TableCell>
                <TableCell>
                  {applications.filter((a) => a.category_slug === category.slug).length}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <CareerCategoryDialog
                      category={category}
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
                          <AlertDialogTitle>Delete "{category.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This can't be undone. Existing applications under this category will
                            need a different category assigned first.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(category.slug)}>
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

const ApplicationsTab = () => {
  const [tab, setTab] = useState<"all" | ApplicationStatus>("all");
  const [selected, setSelected] = useState<JobApplication | null>(null);
  const { data: categories = [] } = useCareerCategories();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => fetchApplications(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
    },
    onError: () => toast({ title: "Couldn't update status", variant: "destructive" }),
  });

  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  const handleViewCv = async (path: string) => {
    try {
      const url = await getCvSignedUrl(path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast({ title: "Couldn't open CV", variant: "destructive" });
    }
  };

  const visible = tab === "all" ? applications : applications.filter((a) => a.status === tab);

  return (
    <div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          {STATUS_TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-destructive py-8">
                  Couldn't load applications. Check your connection and try again.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No applications here yet.
                </TableCell>
              </TableRow>
            )}
            {visible.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {format(new Date(application.created_at), "d MMM, h:mma")}
                </TableCell>
                <TableCell>{application.full_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {categoryName(application.category_slug)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div>{application.email}</div>
                  <div>{application.phone}</div>
                </TableCell>
                <TableCell>
                  <Select
                    value={application.status}
                    onValueChange={(value) =>
                      statusMutation.mutate({ id: application.id, status: value as ApplicationStatus })
                    }
                  >
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["new", "reviewed", "shortlisted", "rejected", "hired"] as ApplicationStatus[]).map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            <Badge variant={STATUS_BADGE[status]} className="capitalize">
                              {status}
                            </Badge>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewCv(application.cv_path)}
                      aria-label="View CV"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setSelected(application)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.full_name}</SheetTitle>
                <SheetDescription>
                  Applied {format(new Date(selected.created_at), "d MMMM yyyy, h:mma")}
                </SheetDescription>
              </SheetHeader>

              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-muted-foreground">Category</dt>
                  <dd>{categoryName(selected.category_slug)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground">Email</dt>
                  <dd>{selected.email}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground">Phone</dt>
                  <dd>{selected.phone}</dd>
                </div>
                {selected.cover_message && (
                  <div>
                    <dt className="font-semibold text-muted-foreground">Message</dt>
                    <dd className="whitespace-pre-wrap">{selected.cover_message}</dd>
                  </div>
                )}
                <div>
                  <Button onClick={() => handleViewCv(selected.cv_path)} size="sm">
                    <FileText className="w-4 h-4 mr-1.5" /> View CV
                  </Button>
                </div>
              </dl>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const AdminCareers = () => {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Careers</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Review job applications and manage the opportunity categories shown on the public
        Careers page.
      </p>

      <Tabs defaultValue="applications" className="mt-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="mt-4">
          <ApplicationsTab />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <CategoriesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCareers;
