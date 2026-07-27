import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";
import { insertGalleryPhoto, deleteGalleryPhoto } from "@/lib/api/gallery";
import { uploadImage } from "@/lib/api/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "@/hooks/use-toast";

const AdminGallery = () => {
  const { data: photos = [], isLoading } = useGalleryPhotos();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });

  const insertMutation = useMutation({
    mutationFn: insertGalleryPhoto,
    onSuccess: () => {
      invalidate();
      toast({ title: "Photo added" });
      setPendingUrl(null);
      setAlt("");
      setCaption("");
    },
    onError: () => toast({ title: "Something went wrong", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGalleryPhoto,
    onSuccess: () => {
      invalidate();
      toast({ title: "Photo deleted" });
    },
    onError: () => toast({ title: "Something went wrong", variant: "destructive" }),
  });

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "gallery");
      setPendingUrl(url);
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!pendingUrl || !alt.trim()) {
      toast({ title: "Add a photo and a short description first", variant: "destructive" });
      return;
    }
    insertMutation.mutate({ imageUrl: pendingUrl, alt: alt.trim(), caption: caption.trim() || undefined });
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Gallery</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Photos shown on the public Gallery page.
      </p>

      <div className="mt-6 border border-border bg-card p-5 max-w-xl">
        <h2 className="font-semibold text-sm">Add a photo</h2>
        <div className="mt-3 flex items-start gap-4">
          {pendingUrl ? (
            <img src={pendingUrl} alt="" className="w-20 h-20 object-cover border border-border" />
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-20 h-20 border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-foreground transition shrink-0"
            >
              <Upload className="w-5 h-5" />
              <span className="text-[10px]">{uploading ? "..." : "Upload"}</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelected}
          />
          <div className="flex-1 space-y-3">
            <div>
              <Label htmlFor="gallery-alt">Short description *</Label>
              <Input
                id="gallery-alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="e.g. Technician servicing a generator"
              />
            </div>
            <div>
              <Label htmlFor="gallery-caption">Caption (optional)</Label>
              <Input
                id="gallery-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. On-site servicing"
              />
            </div>
          </div>
        </div>
        <Button
          className="mt-4"
          onClick={handleSave}
          disabled={insertMutation.isPending || !pendingUrl}
        >
          {insertMutation.isPending ? "Saving..." : "Add to gallery"}
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {photos.map((photo) => (
          <div key={photo.id} className="relative border border-border group">
            <img src={photo.src} alt={photo.alt} className="w-full aspect-[4/3] object-cover" />
            <div className="p-2 text-xs text-muted-foreground truncate">
              {photo.caption ?? photo.alt}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/90"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
                  <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteMutation.mutate(photo.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
