<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep quote submissions stored in Lovable Cloud independently of email delivery so sender-domain setup never causes customer requests to be lost.
- Represent online reference photos separately from verified company projects; only verified project records may carry completion dates.
- Keep uploaded project comparisons in a dedicated gallery with uncropped images so both before and after remain visible.
- Reuse shared company-brand and phone elements across content-page headers so contact details stay consistent.
- Keep the top contact strip shared across content pages and use the dedicated uncropped gallery beneath the homepage photo opening so contact placement and project authenticity stay consistent.
- Home page sections, gallery photos, and project posts are stored in Lovable Cloud tables and edited via /admin; built-in sections are identified by a fixed key so their layout stays in code while text/order/visibility come from the database.
- Admin access is granted only through the user_roles table (owner email auto-granted by a signup trigger); never decide admin status client-side alone.
- Uploaded media lives in the private site-media bucket and is shown via signed URLs because the workspace blocks public buckets.
