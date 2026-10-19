import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2, Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { sectionsQuery, galleryQuery, postsQuery, uploadMedia, slugify, BUCKET, type Section, type Post } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin panel | Calipro Painting" },
      { name: "description", content: "Manage Calipro Painting website content." },
      { property: "og:title", content: "Admin panel — Calipro Painting" },
      { property: "og:description", content: "Owner content management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const BUILTIN_LABELS: Record<string, string> = {
  before_after: "Before & after photos",
  services: "Services",
  about: "About us",
  areas: "Areas we serve",
  advice: "Paint advisor (AI)",
  contact: "Quote request form",
};

const field = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return { admin: false, email: "" };
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      return { admin: !!data, email: u.user.email ?? "" };
    },
  });
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useIsAdmin();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) return <p className="p-10 text-center">Loading…</p>;
  if (!data?.admin)
    return (
      <div className="p-16 text-center font-body">
        <p>{data?.email} does not have admin access.</p>
        <Button className="mt-4" onClick={signOut}>Sign out</Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-secondary/60 font-body text-foreground">
      <header className="flex items-center justify-between border-b bg-card px-6 py-4">
        <h1 className="font-display text-xl font-bold">Calipro admin</h1>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/" className="font-semibold text-primary">View site</Link>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4" />Sign out</Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Tabs defaultValue="sections">
          <TabsList>
            <TabsTrigger value="sections">Home page sections</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="posts">Project posts</TabsTrigger>
          </TabsList>
          <TabsContent value="sections"><SectionsAdmin /></TabsContent>
          <TabsContent value="gallery"><GalleryAdmin /></TabsContent>
          <TabsContent value="posts"><PostsAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function SectionsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(sectionsQuery);
  const refresh = () => qc.invalidateQueries({ queryKey: ["cms", "sections"] });

  async function move(i: number, dir: -1 | 1) {
    const a = data[i], b = data[i + dir];
    if (!a || !b) return;
    await Promise.all([
      supabase.from("site_sections").update({ position: b.position }).eq("id", a.id),
      supabase.from("site_sections").update({ position: a.position }).eq("id", b.id),
    ]);
    // ensure distinct positions if equal
    if (a.position === b.position) await supabase.from("site_sections").update({ position: a.position + dir }).eq("id", a.id);
    refresh();
  }

  async function addSection() {
    const max = Math.max(0, ...data.map((s) => s.position));
    const { error } = await supabase.from("site_sections").insert({ title: "New section", body: "", position: max + 1 });
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-muted-foreground">Edit wording, move sections (including the quote form) up or down, hide them, or add your own sections.</p>
      {data.map((s, i) => (
        <SectionEditor key={s.id} section={s} first={i === 0} last={i === data.length - 1} onMove={(d) => move(i, d)} onChange={refresh} />
      ))}
      <Button onClick={addSection}><Plus className="h-4 w-4" />Add new section</Button>
    </div>
  );
}

function SectionEditor({ section, first, last, onMove, onChange }: { section: Section & { image: string | null }; first: boolean; last: boolean; onMove: (d: -1 | 1) => void; onChange: () => void }) {
  const [title, setTitle] = useState(section.title);
  const [subtitle, setSubtitle] = useState(section.subtitle);
  const [body, setBody] = useState(section.body);
  const [saving, setSaving] = useState(false);
  const custom = !section.key;

  async function save(patch: Partial<Section> = {}) {
    setSaving(true);
    const { error } = await supabase.from("site_sections").update({ title, subtitle, body, ...patch }).eq("id", section.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    onChange();
  }

  async function upload(file?: File) {
    if (!file) return;
    try {
      const path = await uploadMedia(file, "sections");
      if (section.image_path) await supabase.storage.from(BUCKET).remove([section.image_path]);
      await save({ image_path: path });
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function remove() {
    if (!confirm("Delete this section?")) return;
    if (section.image_path) await supabase.storage.from(BUCKET).remove([section.image_path]);
    const { error } = await supabase.from("site_sections").delete().eq("id", section.id);
    if (error) { toast.error(error.message); return; }
    onChange();
  }

  return (
    <div className={`rounded-lg border bg-card p-5 ${section.visible ? "" : "opacity-60"}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase text-primary">{custom ? "Custom section" : BUILTIN_LABELS[section.key!] ?? section.key}</span>
        <div className="flex gap-1">
          <Button size="icon" variant="outline" disabled={first} onClick={() => onMove(-1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" disabled={last} onClick={() => onMove(1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" onClick={() => save({ visible: !section.visible })} aria-label={section.visible ? "Hide" : "Show"}>
            {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          {custom && <Button size="icon" variant="outline" onClick={remove} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>}
        </div>
      </div>
      <div className="grid gap-3">
        <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Heading" />
        <input className={field} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Short intro line (optional)" />
        {(custom || section.key === "about") && (
          <textarea className={field} rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Text" />
        )}
        {custom && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {section.image && <img src={section.image} alt="" className="h-16 w-auto rounded" />}
            <label className="cursor-pointer font-semibold text-primary">
              {section.image ? "Replace image" : "Add image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
            </label>
            {section.image_path && <button className="text-muted-foreground" onClick={() => save({ image_path: null })}>Remove image</button>}
          </div>
        )}
        <div><Button size="sm" onClick={() => save()} disabled={saving}>{saving ? "Saving…" : "Save"}</Button></div>
      </div>
    </div>
  );
}

function GalleryAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(galleryQuery);
  const [category, setCategory] = useState<"general" | "before_after">("general");
  const [uploading, setUploading] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["cms", "gallery"] });

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      let pos = Math.max(0, ...data.map((g) => g.position));
      for (const file of Array.from(files)) {
        const path = await uploadMedia(file, "gallery");
        const { error } = await supabase.from("gallery_images").insert({ storage_path: path, category, position: ++pos });
        if (error) throw error;
      }
      toast.success("Photos added");
    } catch (e) {
      toast.error((e as Error).message);
    }
    setUploading(false);
    refresh();
  }

  async function update(id: string, patch: { caption?: string; description?: string; category?: string }) {
    const { error } = await supabase.from("gallery_images").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  async function remove(id: string, path: string | null) {
    if (!confirm("Remove this photo?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    if (path) await supabase.storage.from(BUCKET).remove([path]);
    refresh();
  }

  async function move(i: number, dir: -1 | 1) {
    const a = data[i], b = data[i + dir];
    if (!a || !b) return;
    const pa = a.position === b.position ? b.position + dir : b.position;
    await Promise.all([
      supabase.from("gallery_images").update({ position: pa }).eq("id", a.id),
      supabase.from("gallery_images").update({ position: a.position }).eq("id", b.id),
    ]);
    refresh();
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-3 rounded-lg border bg-card p-5">
        <select className={`${field} w-auto`} value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
          <option value="general">Our work</option>
          <option value="before_after">Before &amp; after</option>
        </select>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" />{uploading ? "Uploading…" : "Upload photos"}
          <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={(e) => add(e.target.files)} />
        </label>
        <span className="text-xs text-muted-foreground">"Before &amp; after" photos also show on the home page.</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((g, i) => (
          <div key={g.id} className="rounded-lg border bg-card p-3">
            <img src={g.src} alt={g.caption} className="h-44 w-full rounded object-contain bg-secondary" />
            <input className={`${field} mt-3`} defaultValue={g.caption} placeholder="Title" onBlur={(e) => e.target.value !== g.caption && update(g.id, { caption: e.target.value })} />
            <input className={`${field} mt-2`} defaultValue={g.description} placeholder="Description" onBlur={(e) => e.target.value !== g.description && update(g.id, { description: e.target.value })} />
            <div className="mt-2 flex items-center gap-1">
              <select className={`${field} flex-1`} value={g.category} onChange={(e) => update(g.id, { category: e.target.value })}>
                <option value="general">Our work</option>
                <option value="before_after">Before &amp; after</option>
              </select>
              <Button size="icon" variant="outline" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move earlier"><ArrowUp className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" disabled={i === data.length - 1} onClick={() => move(i, 1)} aria-label="Move later"><ArrowDown className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => remove(g.id, g.storage_path)} aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(postsQuery);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["cms", "posts"] });
  const current = data.find((p) => p.id === editing);

  if (editing) return <PostEditor key={editing} post={current} onDone={() => { setEditing(null); refresh(); }} />;

  return (
    <div className="mt-6 space-y-3">
      <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />New project post</Button>
      {data.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
      {data.map((p) => (
        <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            {p.cover && <img src={p.cover} alt="" className="h-12 w-16 rounded object-cover" />}
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.published ? "Published" : "Draft"}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setEditing(p.id)}>Edit</Button>
        </div>
      ))}
    </div>
  );
}

function PostEditor({ post, onDone }: { post?: Post | undefined; onDone: () => void }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [published, setPublished] = useState(post?.published ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim()) { toast.error("Add a title"); return; }
    setSaving(true);
    try {
      let cover_path = post?.cover_path ?? null;
      if (file) cover_path = await uploadMedia(file, "posts");
      const row = { title: title.trim(), excerpt, body, published, cover_path };
      const { error } = post
        ? await supabase.from("project_posts").update(row).eq("id", post.id)
        : await supabase.from("project_posts").insert({ ...row, slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}` });
      if (error) throw error;
      toast.success("Post saved");
      onDone();
    } catch (e) {
      toast.error((e as Error).message);
    }
    setSaving(false);
  }

  async function remove() {
    if (!post || !confirm("Delete this post?")) return;
    await supabase.from("project_posts").delete().eq("id", post.id);
    if (post.cover_path) await supabase.storage.from(BUCKET).remove([post.cover_path]);
    onDone();
  }

  return (
    <div className="mt-6 grid gap-3 rounded-lg border bg-card p-5">
      <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title, e.g. Exterior repaint in Walnut Creek" />
      <input className={field} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary" />
      <textarea className={field} rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tell the story of the project…" />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {post?.cover && !file && <img src={post.cover} alt="" className="h-16 rounded" />}
        <label className="cursor-pointer font-semibold text-primary">
          {file ? file.name : post?.cover ? "Replace cover photo" : "Add cover photo"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <label className="ml-auto inline-flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published
        </label>
      </div>
      <div className="flex gap-2">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save post"}</Button>
        <Button variant="outline" onClick={onDone}>Cancel</Button>
        {post && <Button variant="outline" className="ml-auto" onClick={remove}><Trash2 className="h-4 w-4" />Delete</Button>}
      </div>
    </div>
  );
}
