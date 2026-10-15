CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'azaryagubov90@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_owner_admin AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE lower(email) = 'azaryagubov90@gmail.com'
ON CONFLICT DO NOTHING;

CREATE TABLE public.site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_path text,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_sections TO authenticated;
GRANT ALL ON public.site_sections TO service_role;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads visible sections" ON public.site_sections FOR SELECT TO anon, authenticated USING (visible OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert sections" ON public.site_sections FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update sections" ON public.site_sections FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete sections" ON public.site_sections FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') AND key IS NULL);

INSERT INTO public.site_sections (key, title, subtitle, body, position) VALUES
('before_after', 'Before & after', 'Calipro Painting projects — see the difference, inside and out.', '', 1),
('services', 'What we paint', 'From a single bedroom to an entire office building, every project gets the same care and attention.', '', 2),
('about', 'Neighbours first, painters second', '', 'Calipro Painting started with a ladder, a van, and a simple belief: painting should be stress-free. For over 15 years, families and businesses across the Bay Area have trusted us to show up on time, protect your floors and furniture, and leave every space cleaner than we found it.', 3),
('areas', 'Areas we serve', 'Local crews, fast quotes, and homes and businesses cared for across the East Bay & North Bay.', '', 4),
('advice', 'Ask our paint advisor', 'Not sure which colour or finish to pick? Get instant, AI-powered advice — any time.', '', 5),
('contact', 'Let''s talk about your project', 'Tell us a little about what you''d like painted and we''ll get back to you with a free, no-pressure quote.', '', 6);

CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  storage_path text,
  caption text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'before_after')),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads gallery" ON public.gallery_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert gallery" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update gallery" ON public.gallery_images FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete gallery" ON public.gallery_images FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.gallery_images (image_url, caption, description, category, position) VALUES
('/__l5e/assets-v1/c96443d0-2258-4bff-8fb2-56f882eadf2d/calipro-images.jpg', 'Exterior & trim repaint', 'A lighter exterior with crisp trim detail.', 'before_after', 1),
('/__l5e/assets-v1/c550878a-f67d-4e70-95bd-26df8301d5e1/calipro-images_1.jpg', 'Brick home transformation', 'A fresh finish for the façade and front porch.', 'before_after', 2),
('/__l5e/assets-v1/fbad8561-3148-4f4f-911f-e23a95982d8d/calipro-images_2.jpg', 'Siding & garage refresh', 'Coordinated siding, trim, and a contrasting garage door.', 'before_after', 3),
('/__l5e/assets-v1/58f15ccc-30ef-4b11-a905-5d23cabc815f/calipro-images_3.jpg', 'Painted brick exterior', 'Light painted brick with contrasting window trim.', 'before_after', 4),
('/__l5e/assets-v1/474ab29a-4962-433b-86cd-5eaf845eb049/calipro-images_4.jpg', 'Staircase & entryway', 'Bright walls and a two-tone railing finish.', 'before_after', 5),
('/__l5e/assets-v1/7b21a69d-cf05-42ec-9ff2-6e33f074f1a0/calipro-images_5.jpg', 'Interior room refresh', 'From preparation to a clean, bright wall finish.', 'before_after', 6),
('/__l5e/assets-v1/12058928-9909-47ae-9bd6-aea9fb889225/calipro-images_6.jpg', 'Wall preparation & repaint', 'Patched walls finished in a soft neutral tone.', 'before_after', 7),
('/__l5e/assets-v1/7daa9acf-5973-472e-96cb-f3c7078bf7ed/calipro-images_7.jpg', 'Stairwell repaint', 'Dark walls refreshed with a lighter neutral finish.', 'before_after', 8);

CREATE TABLE public.project_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  cover_path text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.project_posts TO authenticated;
GRANT ALL ON public.project_posts TO service_role;
ALTER TABLE public.project_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published posts" ON public.project_posts FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert posts" ON public.project_posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update posts" ON public.project_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete posts" ON public.project_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone reads site media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'site-media');
CREATE POLICY "Admins upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));