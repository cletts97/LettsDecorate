# Checks and remaining launch tasks

## Completed in this build

Browser rendering checks used Chromium and locally embedded copies of the actual HTML, CSS, JavaScript and supplied image files. They are not a substitute for a deployed Azure test.

- All eight HTML pages checked at viewport widths of **320, 390, 768, 1024 and 1440 pixels**; no horizontal page overflow found.
- Local asset paths, page links and fragment/section links checked against the actual files; no broken references found.
- Each page has one H1, a main landmark, an English language declaration and alt attributes on image elements.
- No JavaScript page exceptions during the checks.
- Homepage colour controls update their appearance and accessible pressed state.
- Mobile menu opens and closes; Escape closes it and restores focus to the menu button.
- Mobile navigation remains available when JavaScript is disabled.
- Empty-gallery category filters work and retain honest coming-soon wording.
- A temporary gallery fixture tested real photo-card rendering, category filters, empty-category messaging, opening the photo viewer, Left/Right navigation, Escape-to-close and focus return. The fixture is not included as a customer project.
- Copy-email controls give either success feedback or a clear manual-copy fallback when browser clipboard access is unavailable.
- The offline photo helper converted a real image, required alternative text, generated a ZIP with valid CRCs and correct file paths, and safely ignored a duplicate imported gallery entry.
- The separate single-file preview was tested for internal navigation, the page picker, its mobile-width control, mobile navigation and contact-page routing.
- Desktop homepage, About, Contact and social-card screenshots were visually reviewed; the mobile homepage was also reviewed.

## Check after deployment, before changing DNS

- Confirm the workflow publishes the contents of `site/`, not the entire repository.
- Check every real page on the Azure-generated hostname, including direct navigation to `/about/`, `/gallery/` and other deep links.
- Confirm URL normalisation, custom 404 status, response headers, Content Security Policy and cache rules on Azure. These have been configured but not exercised against a live Azure resource here.
- Check the site on a real iPhone/Safari and Android device, particularly the photo viewer and external email/phone actions. This package has not been tested in every browser or assistive-technology combination.
- Have the owner approve the business wording, biography, services, contact details and customer review usage.
- Review and complete the business's privacy information. The included page only describes the site's current technical features and directs enquiries to the business.
- Add photographs only with appropriate permission, and check crops, orientation and alternative text on mobile.
- Confirm real phone/email delivery independently. No calls or emails were made during these checks.
- Confirm mailbox and DNS hosting will survive cancellation of the old web-hosting package.
- Validate custom domains and TLS, remove any temporary `noindex` header, select the canonical/default hostname, and test before retiring the old host.

No claim is made of a formal WCAG audit, measured Lighthouse score, guaranteed search ranking, complete legal compliance or an already completed Azure deployment.
