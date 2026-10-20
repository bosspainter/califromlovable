import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Section = Database["public"]["Tables"]["site_sections"]["Row"];
export type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"] & { src: string };
export type Post = Database["public"]["Tables"]["project_posts"]["Row"] & { cover: string | null };

export const BUCKET = "site-media";

async function signPaths(paths: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (!unique.length) return {};
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(unique, 60 * 60 * 24 * 7);
  const map: Record<string, string> = {};
  data?.forEach((d) => {
    if (d.path && d.signedUrl) map[d.path] = d.signedUrl;
  });
  return map;
}

const STALE_TIME = 1000 * 60 * 60 ; // 1 saat
function cmsQuery<T>(name: string, queryFn: () => Promise<T>) {
  return queryOptions({
    queryKey: ["cms", name],
    staleTime: STALE_TIME,
    queryFn,
  });
}

export const sectionsQuery = cmsQuery(
  "sections",
  async (): Promise<(Section & { image: string | null })[]> => {
    const { data, error } = await supabase.from("site_sections").select("*").order("position");
    if (error) throw error;
    const urls = await signPaths(data.map((s) => s.image_path ?? ""));
    return data.map((s) => ({ ...s, image: s.image_path ? (urls[s.image_path] ?? null) : null }));
  },
);

export const galleryQuery = cmsQuery("gallery", async (): Promise<GalleryImage[]> => {
  const { data, error } = await supabase.from("gallery_images").select("*").order("position").order("created_at");
  if (error) throw error;
  const urls = await signPaths(data.map((g) => g.storage_path ?? ""));
  return data
    .map((g) => ({ ...g, src: g.storage_path ? (urls[g.storage_path] ?? "") : (g.image_url ?? "") }))
    .filter((g) => g.src);
});

export const postsQuery = cmsQuery("posts", async (): Promise<Post[]> => {
  const { data, error } = await supabase.from("project_posts").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  const urls = await signPaths(data.map((p) => p.cover_path ?? ""));
  return data.map((p) => ({ ...p, cover: p.cover_path ? (urls[p.cover_path] ?? null) : null }));
});

export async function uploadMedia(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

export function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "post";
}
