Document export dependencies (vendored; loaded only on export)

- docx 9.6.1, browser UMD distribution from the official npm package.
  https://www.npmjs.com/package/docx/v/9.6.1
  License: MIT, see docx-LICENSE.txt.
- pdfmake 0.3.11, browser distribution from the official npm package.
  https://www.npmjs.com/package/pdfmake/v/0.3.11
  License: MIT, see pdfmake-LICENSE.txt.
- Noto Sans SC, static regular instance generated from the official
  Noto Sans CJK 2.004 variable font. Full SC character mapping retained.
  License: SIL OFL 1.1, see NotoSansSC-OFL.txt.
  Sources, hashes and conversion metadata: NotoSansSC-NOTICE.txt and
  NotoSansSC-conversion.json.

PDF export embeds a subset of the Chinese font in the generated file.
Word uses editable text with Noto Sans SC as the preferred East Asian
font, and the user's word processor may fall back to its installed fonts.
No remote conversion service or third-party CDN is called by export.
