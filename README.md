# painontario-dashboard

Static JS for the Pain Ontario board ED-applicant dashboard, embedded at https://www.painontario.ca/data behind a Webflow page password.

The published file `dashboard.js` is loaded into a one-line Webflow Embed via jsDelivr:

```html
<div id="po-dash-root"></div>
<script src="https://cdn.jsdelivr.net/gh/vinamohabir/painontario-dashboard@v1/dashboard.js"></script>
```

To roll out a new version, push to `main` and bump the version tag (e.g. `git tag v2 && git push origin v2`). Then update the `@v1` segment in the Webflow Embed URL to `@v2`.

The dashboard reads from two Google Sheets via the gviz endpoint:
- ED Applications (1JXly9t0KC-hZiOAerGw9S2F8HKHiBD_6QybaTsZu7zk, sheet "Applications")
- Board Comments (1kW-sS2BnUFE03rOzBS8A4GMr9epb9qtyEc9axS31HFk, sheet "Sheet1")

Both must have link-sharing set to "Anyone with the link → Viewer" for the gviz feed to return data publicly. The dashboard itself is gated by Webflow's per-page password on /data.

Comments + review markers are posted to a Make.com webhook (`v8ousg7rd6chye58haam8ny6v0e97651`) which writes rows back to the Comments sheet. Review markers are the literal strings `[REVIEWED]` and `[REVIEWED:UNDO]` in the Comment field.
