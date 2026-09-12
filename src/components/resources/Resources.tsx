import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Download,
  FileText,
  FileType2,
  GraduationCap,
  Presentation,
  Sheet,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Resource {
  id: number;
  title: string;
  course: "CS101" | "Math" | "EE" | "DS";
  kind: "Notes" | "Past Papers" | "Slides" | "Cheat Sheet";
  type: "pdf" | "doc" | "ppt" | "xls";
  uploader: string;
  saves: number;
  size: string;
  savedByMe: boolean;
}

const SEED_RESOURCES: Resource[] = [
  {
    id: 1,
    title: "Complete CS101 lecture notes (weeks 1–12)",
    course: "CS101",
    kind: "Notes",
    type: "pdf",
    uploader: "Yuki Tanaka ⭐",
    saves: 87,
    size: "4.2 MB",
    savedByMe: false,
  },
  {
    id: 2,
    title: "Linear Algebra final — 2019–2024 past papers",
    course: "Math",
    kind: "Past Papers",
    type: "pdf",
    uploader: "Priya Sharma ⭐",
    saves: 142,
    size: "11.8 MB",
    savedByMe: false,
  },
  {
    id: 3,
    title: "Big-O complexity cheat sheet",
    course: "CS101",
    kind: "Cheat Sheet",
    type: "pdf",
    uploader: "Daniel Kim",
    saves: 64,
    size: "0.4 MB",
    savedByMe: false,
  },
  {
    id: 4,
    title: "Signals & Systems worked solutions deck",
    course: "EE",
    kind: "Slides",
    type: "ppt",
    uploader: "Leo Zhang ⭐",
    saves: 39,
    size: "7.6 MB",
    savedByMe: false,
  },
  {
    id: 5,
    title: "Stats formulas spreadsheet (annotated)",
    course: "DS",
    kind: "Notes",
    type: "xls",
    uploader: "Amara Okafor ⭐",
    saves: 51,
    size: "1.1 MB",
    savedByMe: false,
  },
  {
    id: 6,
    title: "OS scheduling — comparison table",
    course: "CS101",
    kind: "Notes",
    type: "doc",
    uploader: "Emma W.",
    saves: 23,
    size: "0.3 MB",
    savedByMe: false,
  },
];

const FILTERS = ["All", "CS101", "Math", "Notes", "Past Papers"] as const;

const TYPE_STYLES: Record<
  Resource["type"],
  { icon: typeof FileText; tint: string }
> = {
  pdf: { icon: FileText, tint: "text-[#d946ef]" },
  doc: { icon: FileType2, tint: "text-primary" },
  ppt: { icon: Presentation, tint: "text-[#e0b356]" },
  xls: { icon: Sheet, tint: "text-[#7cd4a0]" },
};

function initialsOf(name: string) {
  const clean = name.replace(" ⭐", "");
  return clean
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>(SEED_RESOURCES);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", course: "", kind: "" });

  const filtered = useMemo(
    () =>
      resources.filter((r) => {
        if (filter === "All") return true;
        if (filter === "CS101") return r.course === "CS101";
        if (filter === "Math") return r.course === "Math";
        if (filter === "Notes") return r.kind === "Notes";
        return r.kind === "Past Papers";
      }),
    [resources, filter],
  );

  const toggleSave = (id: number) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, savedByMe: !r.savedByMe, saves: r.saves + (r.savedByMe ? -1 : 1) }
          : r,
      ),
    );
    const r = resources.find((x) => x.id === id);
    if (r?.savedByMe) {
      toast("Removed from saved", { description: r.title });
    } else {
      toast.success("Saved to your library", { description: r?.title });
    }
  };

  const handleDownload = (r: Resource) => {
    toast.success(`Downloading “${r.title}”`, {
      description: `${r.size} · shared by ${r.uploader.replace(" ⭐", "")}`,
    });
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.course || !form.kind || !fileName) {
      toast.error("Almost there", {
        description: "Attach a file and fill in title, course, and type.",
      });
      return;
    }
    const ext = fileName.split(".").pop() ?? "pdf";
    const type: Resource["type"] =
      ext === "ppt" || ext === "pptx"
        ? "ppt"
        : ext === "xls" || ext === "xlsx"
          ? "xls"
          : ext === "doc" || ext === "docx"
            ? "doc"
            : "pdf";
    setResources((prev) => [
      {
        id: Date.now(),
        title: form.title.trim(),
        course: form.course as Resource["course"],
        kind: form.kind as Resource["kind"],
        type,
        uploader: "You",
        saves: 0,
        size: `${(Math.random() * 8 + 0.2).toFixed(1)} MB`,
        savedByMe: false,
      },
      ...prev,
    ]);
    setUploadOpen(false);
    setForm({ title: "", course: "", kind: "" });
    setFileName(null);
    toast.success("Resource published!", {
      description: "Your cohort can now find and save it.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="glass glass-soft flex flex-col gap-3 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                filter === f
                  ? "bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
                  : "glass glass-hover text-glass-muted",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white transition-transform duration-200 hover:scale-[1.03]"
        >
          <Upload className="size-4" />
          Upload
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r, i) => {
          const { icon: Icon, tint } = TYPE_STYLES[r.type];
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
              className="glass glass-interactive flex flex-col rounded-3xl p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8a3582]/15 to-[#bf9245]/25",
                    tint,
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <span className="glass glass-soft rounded-full px-2.5 py-1 text-xs font-medium text-primary">
                    {r.course}
                  </span>
                  <span className="glass glass-soft rounded-full px-2.5 py-1 text-xs text-glass-muted">
                    {r.kind}
                  </span>
                </div>
              </div>

              <h3 className="mt-4 leading-snug font-semibold tracking-tight text-card-foreground">
                {r.title}
              </h3>
              <p className="mt-1.5 text-xs text-glass-muted">
                {r.size} · uploaded by{" "}
                <span className="font-medium">{r.uploader.replace(" ⭐", "")}</span>
                {r.uploader.includes("⭐") && (
                  <span className="ml-1 text-[#e0b356]">⭐</span>
                )}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/10">
                <button
                  onClick={() => toggleSave(r.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors",
                    r.savedByMe
                      ? "text-[#e0b356]"
                      : "text-glass-muted hover:text-[#e0b356]",
                  )}
                >
                  {r.savedByMe ? (
                    <BookmarkCheck className="size-4" />
                  ) : (
                    <Bookmark className="size-4" />
                  )}
                  {r.saves}
                </button>
                <Button
                  size="sm"
                  onClick={() => handleDownload(r)}
                  className="cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white transition-transform duration-200 hover:scale-[1.04]"
                >
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass glass-deep rounded-3xl px-8 py-14 text-center">
          <GraduationCap className="mx-auto size-8 text-primary" />
          <h3 className="mt-4 font-semibold text-card-foreground">
            Nothing matches this filter
          </h3>
          <p className="mt-1 text-sm text-glass-muted">
            Be the first — hit Upload and share with your cohort.
          </p>
        </div>
      )}

      {/* Upload modal */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="glass glass-deep max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="tracking-tight text-card-foreground">
              Share a resource
            </DialogTitle>
            <DialogDescription className="text-glass-muted">
              Notes, past papers, slides — your cohort will thank you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Drag & drop */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setFileName(file.name);
                  if (!form.title)
                    setForm((f) => ({
                      ...f,
                      title: file.name.replace(/\.[^.]+$/, ""),
                    }));
                }
              }}
              className={cn(
                "glass flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200",
                dragging && "scale-[1.01] border-[#e0b356] bg-white/10",
              )}
              onClick={() =>
                document.getElementById("resource-file-input")?.click()
              }
            >
              <Upload className="size-6 text-primary" />
              <p className="mt-3 text-sm font-medium text-card-foreground">
                {fileName ?? "Drag & drop a file here"}
              </p>
              <p className="mt-1 text-xs text-glass-muted">
                {fileName
                  ? "Click to replace"
                  : "or click to browse · PDF, DOC, PPT, XLS"}
              </p>
              <input
                id="resource-file-input"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileName(file.name);
                    if (!form.title)
                      setForm((f) => ({
                        ...f,
                        title: file.name.replace(/\.[^.]+$/, ""),
                      }));
                  }
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider uppercase text-glass-muted">
                Title
              </label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Week 6 tutorial solutions"
                className="glass-hover h-11 rounded-xl bg-transparent"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider uppercase text-glass-muted">
                  Course
                </label>
                <Select
                  value={form.course}
                  onValueChange={(v) => setForm((f) => ({ ...f, course: v }))}
                >
                  <SelectTrigger className="glass-hover w-full rounded-xl bg-transparent">
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent className="glass glass-deep rounded-xl">
                    {["CS101", "Math", "EE", "DS"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider uppercase text-glass-muted">
                  Type
                </label>
                <Select
                  value={form.kind}
                  onValueChange={(v) => setForm((f) => ({ ...f, kind: v }))}
                >
                  <SelectTrigger className="glass-hover w-full rounded-xl bg-transparent">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="glass glass-deep rounded-xl">
                    {["Notes", "Past Papers", "Slides", "Cheat Sheet"].map(
                      (k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadOpen(false)}
                className="glass-hover cursor-pointer rounded-xl bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
              >
                <Upload className="size-4" />
                Publish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
