import { primaryNavigation } from "../lib/content";
import { withBasePath } from "../lib/basePath";

export function Arrow() {
  return (
    <span aria-hidden="true" className="arrow">
      ↗
    </span>
  );
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <a
      className={`brand ${inverse ? "brand-inverse" : ""}`}
      href={withBasePath("/")}
      aria-label="KRD-IG — strona główna"
    >
      <img src={withBasePath("/media/logo-krd-ig.svg")} alt="KRD-IG" />
    </a>
  );
}

export function SiteHeader() {
  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <p>Krajowa Rada Drobiarstwa — Izba Gospodarcza</p>
          <nav aria-label="Nawigacja pomocnicza">
            <a href={withBasePath("/dezinformacja")}>DEZINFORMACJA</a>
            <a href={withBasePath("/zapytania-ofertowe")}>ZAPYTANIA OFERTOWE</a>
            <a href={withBasePath("/dokumenty")}>DOKUMENTY</a>
            <a href={withBasePath("/kontakt")}>KONTAKT</a>
            <a href="https://krd-ig.com.pl/en/" lang="en">
              EN
            </a>
          </nav>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Główna nawigacja">
            {primaryNavigation.map((item) => (
              <a href={withBasePath(item.href)} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="button button-primary header-cta" href={withBasePath("/czlonkostwo")}>
            Członkostwo <Arrow />
          </a>
          <details className="mobile-menu">
            <summary aria-label="Otwórz menu">
              <span />
              <span />
            </summary>
            <nav aria-label="Nawigacja mobilna">
              {primaryNavigation.map((item) => (
                <a href={withBasePath(item.href)} key={item.href}>
                  {item.label}
                </a>
              ))}
              <a href={withBasePath("/dezinformacja")}>DEZINFORMACJA</a>
              <a href={withBasePath("/zapytania-ofertowe")}>ZAPYTANIA OFERTOWE</a>
              <a href={withBasePath("/dokumenty")}>DOKUMENTY</a>
              <a href={withBasePath("/czlonkostwo")}>CZŁONKOSTWO</a>
              <a href={withBasePath("/kontakt")}>KONTAKT</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div>
          <Brand inverse />
          <p className="footer-mission">
            Partner i głos polskiego sektora drobiarskiego w kraju, Europie i
            na świecie.
          </p>
        </div>
        <div className="footer-column">
          <h2 className="footer-section-title">SERWIS</h2>
          <a href={withBasePath("/o-izbie")}>O Izbie</a>
          <a href={withBasePath("/rynek")}>Rynek i handel</a>
          <a href={withBasePath("/hodowla")}>Hodowla i ocena</a>
          <a href={withBasePath("/zrownowazony-rozwoj")}>Jakość i rozwój</a>
          <a href={withBasePath("/aktualnosci")}>Aktualności</a>
          <a href={withBasePath("/zapytania-ofertowe")}>Zapytania ofertowe</a>
        </div>
        <div className="footer-column">
          <h2 className="footer-section-title">INFORMACJE</h2>
          <a href={withBasePath("/baza-wiedzy")}>Baza wiedzy</a>
          <a href={withBasePath("/dokumenty")}>Dokumenty i przetargi</a>
          <a href={withBasePath("/czlonkostwo")}>Członkostwo</a>
          <a href={withBasePath("/tresc/polityka-prywatnosci")}>Polityka prywatności</a>
          <a href={withBasePath("/tresc/polityka-cookies")}>Polityka cookies</a>
        </div>
        <div className="footer-column footer-contact">
          <h2 className="footer-section-title">KONTAKT</h2>
          <a href="mailto:krd-ig@krd-ig.com.pl">krd-ig@krd-ig.com.pl</a>
          <a href="tel:+48228282389">+48 22 828 23 89</a>
          <address>
            ul. Czackiego 3/5
            <br />
            00-043 Warszawa
          </address>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>© 2026 Krajowa Rada Drobiarstwa — Izba Gospodarcza</p>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
