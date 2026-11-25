const markdown = await Deno.readTextFile(
  new URL("../../html.md", import.meta.url),
);
const links = [...markdown.matchAll(
  /^\s*\d+\.\s+\[(\d{3}-[^\]\r\n]+)\]\((https?:\/\/[^\s)]+)\)/gm,
)];

const [slug] = Deno.args;
const articles = slug ? links.filter(([, name]) => name === slug) : links;
if (articles.length === 0) {
  console.error(
    slug ? `Статья не найдена: ${slug}` : "В html.md нет ссылок на статьи.",
  );
  Deno.exit(1);
}

async function getLogoLink(articleUrl: string): Promise<string> {
  const response = await fetch(articleUrl, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (!/\sproperty\s*=\s*(['"])og:image\1/i.test(tag)) continue;
    const image = /\scontent\s*=\s*(['"])(.*?)\1/i.exec(tag)?.[2];
    if (image) {
      return new URL(image.replaceAll("&amp;", "&"), response.url).href;
    }
  }
  throw new Error("Метатег og:image не содержит ссылки");
}

const batchSize = 5;
for (let start = 0; start < articles.length; start += batchSize) {
  const batch = articles.slice(start, start + batchSize);
  const results = await Promise.allSettled(
    batch.map(([, , articleUrl]) => getLogoLink(articleUrl)),
  );

  for (const [index, result] of results.entries()) {
    const [, name, articleUrl] = batch[index];
    if (result.status === "fulfilled") {
      console.log(`${name}\t${result.value}`);
    } else {
      console.error(`${name} (${articleUrl}): ${result.reason}`);
      Deno.exitCode = 1;
    }
  }
}
