# ru-spintax-net

GitHub Pages deploy target for **`ru.spintax.net`** — the Russia-reachable mirror of the
Russian version of [spintax.net](https://spintax.net).

Why this exists: Cloudflare Pages (which serves `spintax.net`) is unreachable from Russia.
The Russian locale is published here on GitHub Pages instead, which is reachable from RF.

- **Content is generated** by the `ru` build target of the main `spintax.net` repository
  (`dist-ru/`) — do not hand-edit HTML here.
- Custom domain: `ru.spintax.net` (see `CNAME`), DNS: `CNAME → investblog.github.io` (DNS-only).
- Plan / architecture: `.agents/plans/active/ru-subdomain-github-pages.md` in the main repo.

The current `index.html` is a `noindex` placeholder until the first real build is published.
