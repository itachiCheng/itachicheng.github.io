---
name: blog-svg-figures
description: Use when creating paper-reading or technical blog posts for the user's Hexo GitHub Pages site that need local-previewable and deploy-safe SVG figures stored in per-post asset folders.
---

# Blog SVG Figures

## Goal

Create lightweight SVG diagrams for paper-reading or technical posts. Figures must work in both local Markdown preview and deployed Hexo pages.

## Repository Pattern

For a post named `DFlash`:

```text
source/_posts/DFlash.md
source/_posts/DFlash/
  dflash-inference.svg
  kv-injection.svg
  speedup-comparison.svg
```

Set the post cover to the first meaningful image in the post asset folder:

```yaml
cover: dflash-inference.svg
```

If the post has no asset folder or no meaningful image assets, omit `cover:` and let Butterfly use the site's default cover.

In Markdown, reference images with the post-name folder:

```markdown
![DFlash inference overview](./DFlash/dflash-inference.svg)
```

This supports local Markdown preview from the source file. The site has `scripts/post-asset-path.js`, which rewrites same-post asset paths during Hexo rendering so deployed pages use `./figure.svg` under `/PostName/`.

## Figure Style

Prefer SVG for:

- method pipeline diagrams
- architecture diagrams
- training/inference flow
- ablation or result summaries
- simple charts recreated from paper tables

Keep SVGs:

- self-contained, with no external assets
- readable on the site's light theme
- fixed dimensions and a `viewBox`
- ASCII text unless the surrounding post needs Chinese labels
- restrained in color; use blue for target models, green for draft/model modules, and yellow for verification/cache/context

Do not create a standalone `cover.svg` by default. The article cover should point to the first real content figure when one exists. This keeps the home card grounded in the article itself and avoids generic decorative covers.

## Workflow

1. Create `source/_posts/<PostName>/`.
2. Add one SVG per concept with descriptive kebab-case names.
3. Set `cover:` to the first meaningful image in the post asset folder. If no image exists, omit `cover:`.
4. Reference inline images in `<PostName>.md` as `./<PostName>/<figure>.svg`.
5. Run `hexo clean && hexo generate`.
6. Verify generated HTML contains `src="./figure.svg"` for inline figures and `/PostName/<cover-file>` for covers.
7. Verify the assets exist under `public/<PostName>/`.

## Recommended Figures

For paper reading posts, usually create 2-4 figures:

- `method-overview.svg`: main idea or system pipeline
- `architecture.svg`: module-level structure
- `training.svg`: training data, mask, or loss flow
- `result-summary.svg`: key speedup, accuracy, or ablation comparison

## Avoid

- Do not reference post assets as `./figure.svg` in source Markdown; local Markdown preview will fail.
- Do not reference post assets as `/PostName/figure.svg` unless local preview is not needed.
- Do not put blog figures under `papers/`; that folder is ignored and only stores source PDFs.
