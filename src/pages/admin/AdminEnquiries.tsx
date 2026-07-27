import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import {
  Enquiry,
  EnquiryStatus,
  fetchEnquiries,
  updateEnquiryStatus,
} from "@/lib/api/enquiries";
import { formatPrice } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { toast } from "@/hooks/use-toast";

const TABS: { value: "all" | EnquiryStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "done", label: "Done" },
  { value: "archived", label: "Archived" },
];

const STATUS_BADGE: Record<EnquiryStatus, "default" | "secondary" | "outline"> = {
  new: "default",
  contacted: "secondary",
  done: "outline",
  archived: "outline",
};

const AdminEnquiries = () => {
  const [tab, setTab] = useState<"all" | EnquiryStatus>("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const queryClient = useQueryClient();

  const { data: enquiries = [], isLoading, isError } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: () => fetchEnquiries(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryStatus }) =>
      updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
    },
    onError: () => {
      toast({ title: "Couldn't update status", variant: "destructive" });
    },
  });

  const visible = tab === "all" ? enquiries : enquiries.filter((e) => e.status === tab);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Enquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Quote requests and order requests submitted through the website.
      </p>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-6">
        <TabsList>
          {TABS.map((t) => (
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
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-destructive py-8">
                  Couldn't load enquiries. Check your connection and try again.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No enquiries here yet.
                </TableCell>
              </TableRow>
            )}
            {visible.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {format(new Date(enquiry.created_at), "d MMM, h:mma")}
                </TableCell>
                <TableCell className="capitalize">{enquiry.type}</TableCell>
                <TableCell>{enquiry.name}</TableCell>
                <TableCell className="whitespace-nowrap">{enquiry.phone}</TableCell>
                <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">
                  {enquiry.type === "quote"
                    ? enquiry.service ?? "—"
                    : `${enquiry.items?.length ?? 0} item(s) · ${formatPrice(enquiry.total ?? 0)}`}
                </TableCell>
                <TableCell>
                  <Select
                    value={enquiry.status}
                    onValueChange={(value) =>
                      statusMutation.mutate({ id: enquiry.id, status: value as EnquiryStatus })
                    }
                  >
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["new", "contacted", "done", "archived"] as EnquiryStatus[]).map((status) => (
                        <SelectItem key={status} value={status}>
                          <Badge variant={STATUS_BADGE[status]} className="capitalize">
                            {status}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => setSelected(enquiry)}>
                    <Eye className="w-4 h-4" />
                  </Button>
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
                <SheetTitle className="capitalize">{selected.type} request</SheetTitle>
                <SheetDescription>
                  {format(new Date(selected.created_at), "d MMMM yyyy, h:mma")}
                </SheetDescription>
              </SheetHeader>

              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-muted-foreground">Name</dt>
                  <dd>{selected.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground">Phone</dt>
                  <dd>{selected.phone}</dd>
                </div>
                {selected.service && (
                  <div>
                    <dt className="font-semibold text-muted-foreground">Service</dt>
                    <dd>{selected.service}</dd>
                  </div>
                )}
                {selected.location && (
                  <div>
                    <dt className="font-semibold text-muted-foreground">Location</dt>
                    <dd>{selected.location}</dd>
                  </div>
                )}
                {selected.message && (
                  <div>
                    <dt className="font-semibold text-muted-foreground">Message</dt>
                    <dd className="whitespace-pre-wrap">{selected.message}</dd>
                  </div>
                )}
                {selected.notes && (
                  <div>
                    <dt className="font-semibold text-muted-foreground">Notes</dt>
                    <dd className="whitespace-pre-wrap">{selected.notes}</dd>
                  </div>
                )}
                {selected.items && selected.items.length > 0 && (
                  <div>
                    <dt className="font-semibold text-muted-foreground">Items</dt>
                    <dd>
                      <ul className="mt-1 space-y-1">
                        {selected.items.map((item, i) => (
                          <li key={i} className="flex justify-between gap-3">
                            <span>
                              {item.quantity} × {item.name}
                            </span>
                            <span>{formatPrice(item.lineTotal)}</span>
                          </li>
                        ))}
                      </ul>
                      {selected.total != null && (
                        <p className="mt-2 font-semibold">Total: {formatPrice(selected.total)}</p>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminEnquiries;
