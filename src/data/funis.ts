import config from '../../config.json';

const P = config.media.cdn_base + '/photos';

// ---------------------------------------------------------------
// HUB (/): descobre sozinho as páginas de src/pages/*.astro.
// Página nova => aparece no hub automaticamente (label = slug formatado,
// imagem = hero). Para personalizar, adicione uma entrada em `overrides`.
// ---------------------------------------------------------------
interface HubEntry { label?: string; img?: string; hidden?: boolean; order?: number }

const overrides: Record<string, HubEntry> = {
  'eventos-corporativos': { label: 'Eventos Corporativos', img: `${P}/lespai-cateringcorporativo-hero.webp`, order: 1 },
  bio: { label: 'BIO', img: `${P}/lespai-cateringcorporativo-tiposdeeventos5.webp`, order: 99 },
  // 404: { hidden: true },
};

const prettify = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

const modules = import.meta.glob('../pages/*.astro');

export const funis = Object.keys(modules)
  .map((p) => p.split('/').pop()!.replace('.astro', ''))
  .filter((slug) => slug !== 'index' && !overrides[slug]?.hidden)
  .map((slug) => ({
    id: slug,
    label: overrides[slug]?.label ?? prettify(slug),
    img: overrides[slug]?.img ?? `${P}/lespai-cateringcorporativo-hero.webp`,
    href: `/${slug}`,
    external: false,
    order: overrides[slug]?.order ?? 50,
  }))
  .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));

// ---------------------------------------------------------------
// Abas da BIO (links manuais; LPs futuras de casamentos/sociais entram aqui)
// ---------------------------------------------------------------
export const abasBio = [
  { id: 'casamentos',   label: 'Casamentos',      href: config.site_url,        external: true },
  { id: 'corporativos', label: 'Corporativos',    href: '/eventos-corporativos', external: false },
  { id: 'sociais',      label: 'Eventos Sociais', href: config.site_url,        external: true },
];
