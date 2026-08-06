import { ArticleBody } from "../../components/ArticleBody";
import { PageShell } from "../../components/SiteChrome";
import { withBasePath } from "../../lib/basePath";
import { formatDate, newsPosts, postBySlug } from "../../lib/content";

export function generateStaticParams() {
  return newsPosts.map((post) => ({ slug: post.slug }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug(slug);
  const shouldCompactStopDezinformacjiTitle =
    slug === "kampania-stopdezinformacjizywnosciowej-i-kluczowe-wyzwania-rynkowe";
  const shouldUseAlimentariaTitleSize =
    slug ===
    "polish-poultry-na-alimentaria-2026-rekordowa-edycja-rekordowa-energia-rekordowa-polska";
  const shouldContainWoahLogoImage =
    slug === "polska-odzyskala-status-kraju-wolnego-od-grypy-ptakow-2026";

  if (!post) {
    return (
      <PageShell>
        <section className="simple-hero">
          <div className="shell">
            <h1>Nie znaleziono materiału</h1>
            <a href={withBasePath("/aktualnosci")}>Wróć do archiwum</a>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="article-hero">
        <div className="shell article-hero-grid">
          <div>
            <p className="article-kicker">
              {post.categories.join(" · ")} · {formatDate(post.date)}
            </p>
            {shouldCompactStopDezinformacjiTitle ? (
              <h1 className="article-title-campaign-split">
                <span className="article-title-line">Kampania</span>
                <span className="article-title-hashtag-line">#StopDezinformacjiŻywnościowej</span>
                <span className="article-title-line">i kluczowe wyzwania rynkowe</span>
              </h1>
            ) : (
              <h1 className={shouldUseAlimentariaTitleSize ? "article-title-alimentaria-compact" : undefined}>{post.title}</h1>
            )}
            {post.excerpt && <p>{post.excerpt}</p>}
          </div>
          {post.image && (
            <img
              src={withBasePath(post.image)}
              alt=""
              className={shouldContainWoahLogoImage ? "article-hero-image-contain" : undefined}
            />
          )}
        </div>
      </section>
      <ArticleBody
        paragraphs={post.paragraphs}
        links={post.links}
        source={post.source}
        slug={slug}
      />
    </PageShell>
  );
}
