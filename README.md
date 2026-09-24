# Letts Decorate

A complete static website for the painting and decorating business at lettsdecorate.co.uk.

**Start with `site/index.html`.** The website is already built. There is no npm install, compilation, WordPress, database, contact-form service or application server to run.

## What is included

- Home, Services, Gallery, About, Testimonials and Contact pages.
- The existing `/about/`, `/gallery/`, `/testimonials/` and `/contact/` addresses, plus a new `/services/` page.
- Your original logo, a header icon cropped from that logo, and resized WebP copies of the supplied portrait. The originals are also retained outside the public site folder.
- A paint-swatch hero with three colour inspirations. This is a graphic, not a project photograph or a paint manufacturer's colour-matching tool.
- Clearly labelled gallery placeholders, category filters and a keyboard-accessible photo viewer ready for actual images.
- Click-to-call, click-to-email and copy-email controls. No enquiry form or review-submission form.
- An offline gallery helper, described below.
- Page descriptions, canonical addresses, a sitemap, robots.txt, favicons and a social-sharing image.
- Azure Static Web Apps configuration and a GitHub Actions deployment workflow.

## Open and preview

Extract the ZIP before opening the files. Double-click `site/index.html` to browse the normal pages locally. Navigation deliberately uses relative links to `index.html`, so it works without a web server. Azure normalises those addresses to the original clean directory URLs when hosted.

For a closer simulation of hosting, open PowerShell in this folder and run:

```powershell
py -m http.server 8080 --bind 127.0.0.1 --directory site
```

Then visit `http://localhost:8080` and press Ctrl+C in PowerShell when finished. This command needs an existing Python installation. VS Code Live Server is another option.

The regular Python server does not apply Azure's response headers, custom 404 handling or URL-normalisation rules. Check those after deployment. Opening `404.html` directly from disk also does not reproduce its hosted behaviour.

If the separate single-file design preview was supplied with the ZIP, that preview embeds the pages and assets and lets you switch between desktop and mobile views. It is a review convenience, **not the file to deploy**.

## Folder layout

```text
letts-decorate/
  README.md
  CONTENT-NOTES.md
  QA-NOTES.md
  .github/workflows/deploy.yml
  originals/                       Original supplied images; not deployed
  tools/gallery-helper.html        Offline photo preparation; not deployed
  site/                            THIS is the public website
    index.html
    services/index.html
    gallery/index.html
    about/index.html
    testimonials/index.html
    contact/index.html
    privacy/index.html
    404.html
    staticwebapp.config.json
    robots.txt
    sitemap.xml
    assets/
      css/site.css
      js/site.js
      js/gallery-data.js
      images/
        logo-original.png
        brand-mark.png
        about-480.webp
        about-800.webp
        social-card.png
        gallery/
```

## Add gallery photographs without writing code

1. Open `tools/gallery-helper.html` in a recent Edge or Chrome browser. It works locally; it does not upload your photographs.
2. If the site already has gallery photos, import your current `site/assets/js/gallery-data.js` first. For the first set of photos, skip this.
3. Choose or drag in your new JPG, PNG, WebP or AVIF photographs. The helper makes smaller WebP copies, defaults to a 1600-pixel maximum long edge, and never enlarges a smaller original. It does not change your source files. Unsupported browser encoders may fall back to PNG.
4. Set a title and category, and write alternative text that describes what is actually in each image. Use Move up / Move down to choose the order; the first three photographs appear on the homepage.
5. Download the gallery-update ZIP. Extract it into this project folder, merging its `site` folder with yours. Allow it to replace `site/assets/js/gallery-data.js`.
6. Preview the website, then commit and push the changed files to GitHub.

**Important:** the generated data file is the complete gallery list. Import the existing file first when adding photos, or the previous entries will disappear from the displayed gallery. Existing image files are not included in the update ZIP; keep them in your repository. The helper does not automatically delete old image files.

Once a valid photo is added, the website replaces the placeholder cards with the real photographs and removes the coming-soon message. Categories with no photographs show a clear empty state. Clicking a photograph opens the viewer; Left/Right moves between images in the selected category and Escape closes it.

The gallery helper is intentionally **not a hosted administration screen**. Publishing still means replacing the files in your repository and deploying them.

### Manual alternative

Put your photographs in `site/assets/images/gallery/` and edit `site/assets/js/gallery-data.js`:

```javascript
window.LETTS_GALLERY = [
  {
    "src": "assets/images/gallery/living-room.webp",
    "title": "Living room refresh",
    "alt": "Replace this with a description of the actual photograph",
    "category": "interior",
    "width": 1600,
    "height": 1067
  }
];
```

Use `interior`, `exterior` or `detail`. Width and height must be the actual image dimensions; they are optional when adding files manually. Image paths must be within `assets/images/gallery/`, with no spaces, parent-directory references or remote URLs. JPEG, PNG, WebP and AVIF are accepted.

Choose new filenames when replacing existing photographs, rather than overwriting a cached image with different content. Image responses are cached for one day; CSS and JavaScript are configured to revalidate.

## Change wording or branding

Pages are plain HTML, ready to edit in VS Code. Search for the visible wording in the relevant `index.html` file.

The main colours are at the top of `site/assets/css/site.css`. Typography uses system fonts; no font files or externally hosted fonts are included. All decorative shapes are CSS, with small inline SVG interface icons.

Shared navigation and footer markup is repeated in each HTML page so the website works without JavaScript. When changing contact details or the menu, use Find in Files to update every page. Do not change just the homepage. Also update the structured-data block, page descriptions and contact links where appropriate.

To replace the logo later, update `logo-original.png` and the separate cropped `brand-mark.png`. Recreate the favicons and social-sharing image to match. Keep the replacement logo's transparent background where appropriate.

The script hash in the Content-Security-Policy applies to the inline structured-data block. If you edit that block, regenerate its SHA-256 hash or update the policy appropriately. Do not weaken the policy to allow arbitrary inline scripts just to work around it.

The two optimised portrait files come from your upload. No generative edits have been made to the portrait.

## Deploy to Azure Static Web Apps

Only deploy the `site/` folder. Do not expose the originals, instructions or offline helper as part of the public app.

### Use the included workflow

1. Create a GitHub repository and keep the folder structure above at its root, including the hidden `.github` folder. The production branch is `main`.
2. In Azure, create a Static Web App and choose **Other** under deployment source. Select the hosting plan deliberately; see the note below.
3. In the new Static Web App, use **Manage deployment token** (or **Manage token**) to obtain the deployment token.
4. In the GitHub repository, open **Settings > Secrets and variables > Actions** and create a repository secret named exactly `AZURE_STATIC_WEB_APPS_API_TOKEN`. Put the deployment token in that secret, never in a source file.
5. Push the project to `main`. The included workflow publishes `site/` directly, skipping both application and API builds. It can also be started manually from GitHub Actions. If an earlier run happened before you added the secret, rerun it.
6. Test all pages, menu controls, galleries and contact links on the generated Azure hostname.

The relevant workflow settings are:

```yaml
app_location: site
api_location: ''
output_location: ''
skip_app_build: true
skip_api_build: true
```

There is no build output folder because these are already the final files.

**Using Azure's GitHub setup wizard instead:** let Azure create its own workflow and secret, set its app location to `site`, leave API/output locations empty, and add `skip_app_build: true`. Keep only one deployment workflow; remove this package's `deploy.yml` if Azure generated another one. Do not overwrite Azure's generated secret reference with the sample name unless you have created that secret.

The included workflow only publishes `main`; it does not create pull-request preview environments.

### Free plan trade-off

Microsoft currently describes Free as for personal projects, with no SLA; Standard is positioned for production apps and includes an SLA. Free may be an acceptable trade-off for this small brochure site, but it is not equivalent to a paid availability/support commitment. Domain registration, email hosting and any other paid services remain separate. Check current plan limits before launch.

### Domain, DNS and email

Keep the current registrar. You do not have to transfer the domain to Azure.

Add and validate the custom domains only after the preview is working. Use the records that Azure actually supplies. `www` normally uses a CNAME. The apex/root-domain method depends on the DNS provider's support for ALIAS/ANAME/flattening or Azure's documented A-record approach. Do not guess a target IP or assume the registrar also hosts the DNS zone.

Once both desired hostnames are validated and ready, use Azure's **Custom domains > Set default** for `lettsdecorate.co.uk`. This handles hostname redirection. Do not add a catch-all route that redirects every path to the homepage.

While reviewing on a public preview hostname, you can temporarily add `"X-Robots-Tag": "noindex, nofollow"` to `globalHeaders` in `staticwebapp.config.json`. Remove that setting for production. It discourages indexing but does not make the site private.

**Do not cancel the old hosting until you have checked email and DNS dependencies.** The published address is `contact@lettsdecorate.co.uk`. If its mailbox or forwarding service comes with the old hosting package, arrange replacement email hosting before cancelling it. Preserve the MX, SPF, DKIM and DMARC records. Also confirm that DNS hosting itself will remain active.

Keep the old site available for rollback during the cut-over, and retain any obtainable WordPress backups. This rebuild does not migrate WordPress admin accounts, emails, historical form submissions or unpublished material.

## Before going live

Have your brother review all business wording, current services, contact details and photo permissions. In particular, the historical story comes from the existing site, not a current interview.

The Website & Privacy page describes this site's technical behaviour. It is **not a completed, independently verified privacy notice for all business activity**. Review and extend it to match how the business handles enquiries, photos, retention and third-party services before launch. This build does not invent a retention period, opening hours, current insurance status, accreditations, guarantees or review scores.

Review the browser tests and remaining live-host checks in `QA-NOTES.md`.

## Technical references

Checked on 24 September 2026:

- [Azure build configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
- [Azure configuration and trailing slashes](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
- [Deployment source Other and deployment tokens](https://learn.microsoft.com/en-us/azure/static-web-apps/external-providers)
- [Custom domains](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain)
- [Set a default domain](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain-default)
- [Free and Standard plans](https://learn.microsoft.com/en-us/azure/static-web-apps/plans)

UI labels and service capabilities can change. The Azure resource, GitHub repository, live DNS changes and production deployment have not been created or performed as part of this package.
