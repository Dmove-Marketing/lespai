// Gera public/embed/lespai-wa-widget.js: o popup de WhatsApp do padrão Dmove (WhatsAppWidget.astro)
// empacotado como script independente, para instalar no Wix (Código personalizado).
// Uso: node tools/build-wa-embed.mjs
import fs from 'node:fs';

const cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const src = fs.readFileSync('src/components/ui/WhatsAppWidget.astro', 'utf8').replace(/\r\n/g, '\n');
const lead = fs.readFileSync('src/scripts/lead-payload.ts', 'utf8');
const presets = fs.readFileSync('src/scripts/form-presets.ts', 'utf8');

// ---- Configuração do embed (site Wix) ----
const CONFIG = {
  displayName: "L'Espai Banqueteria",
  phone: '5511961882002',
  avatar: cfg.media.cdn_base + '/photos/favicon.webp',
  submitUrl: 'https://server3n8n.dmove.com.br/webhook/lespai-site', // webhook do SITE (mesmo do formulário do Wix; o nó "Normaliza Wix" converte o formato)
  project: 'lespai-site',
  fonte: 'Site',          // "Site" roteia para o endpoint "Site" do Voe (ver nó Voe no n8n)
  origem: 'Orgânico',
};

// ---- Opções de tipo de evento: mesmas da BIO (preset "geral") ----
const parseOpts = (name) => {
  const m = lead.match(new RegExp(`export const ${name}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\];`));
  return [...m[1].matchAll(/value:\s*'([^']*)',\s*label:\s*'([^']*)'/g)].map((x) => ({ value: x[1], label: x[2] }));
};
const soc = parseOpts('tipoEventoOptions');
const corp = parseOpts('tipoEventoCorporativoOptions');
const tipos = [
  ...soc.filter((o) => o.value !== 'Outros'),
  ...corp.filter((o) => o.value !== 'Outros' && !soc.some((t) => t.value === o.value)),
  { value: 'Outros', label: 'Outros' },
].sort((a, b) => (a.value === 'Outros' ? 1 : b.value === 'Outros' ? -1 : a.label.localeCompare(b.label, 'pt-BR')));

const fields = [
  { key: 'nome', type: 'text', label: 'Pra começar, qual é o seu nome? 😊', placeholder: 'Seu nome' },
  { key: 'tel', type: 'phone', label: 'Qual é o seu WhatsApp com DDD?', placeholder: '(11) 99999-9999' },
  { key: 'email', type: 'email', label: 'E o seu e-mail?', placeholder: 'seu@email.com' },
  { key: 'tipo_evento', type: 'select', label: 'Que tipo de evento você quer celebrar? 🥂', options: tipos },
  { key: 'data_evento', type: 'date', label: 'Qual é a data prevista do evento? 📅', placeholder: 'dd/mm/aaaa' },
  { key: 'convidados', type: 'number', label: 'E quantos convidados, aproximadamente?', placeholder: 'Ex: 150', chips: ['50', '100', '150', '200', '300'] },
];
const introMessages = [
  `Olá! 👋 Bem-vindo(a) à ${CONFIG.displayName}.`,
  'Vou te fazer algumas perguntas rápidas para preparar o seu orçamento, tudo bem?',
];

// ---- Markup ----
let markup = src.slice(src.indexOf('<div id="wa-widget"'), src.indexOf('<script define:vars'));
markup = markup
  .replace(/\{avatar\}/g, JSON.stringify(CONFIG.avatar))
  .replace(/\{displayName\.charAt\(0\)\}/g, CONFIG.displayName.charAt(0))
  .replace(/\{displayName\}/g, CONFIG.displayName)
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<form data-wa-form[\s\S]*?<\/form>/, ''); // espelho do GTM não é necessário no Wix

// ---- CSS (sem escopo do Astro) ----
let css = src.slice(src.indexOf('<style>') + 7, src.indexOf('</style>'));
css = css.replace(/:global\(((?:[^()]|\([^()]*\))*)\)/g, '$1');
css = `#wa-widget{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}\n#wa-widget *{box-sizing:border-box}\n` + css;

// ---- JS ----
let js = src.slice(src.indexOf('<script define:vars'), src.indexOf('</script>'));
js = js.slice(js.indexOf('>') + 1);

// formato do Wix (submissions[] com rótulo/valor): o webhook lespai-site espera esse formato
js = js.replace('async function submitLead() {', `const toWixShape = (p, a) => ({
    formName: 'Popup WhatsApp (site)',
    submissions: [
      { label: 'Nome e Sobrenome', value: p.Nome },
      { label: 'Email', value: p['E-mail'] },
      { label: 'Telefone com DDD', value: p.WhatsApp },
      { label: 'Tipo de Evento', value: a.tipo_evento?.display || p['Tipo de evento'] },
      { label: 'Nº de Convidados', value: p.Convidados },
      { label: 'Data do Evento', value: p['Data do evento'] },
      { label: 'Message', value: 'Lead via popup de WhatsApp do site' },
    ],
    submissionTime: new Date().toISOString(),
  });
  async function submitLead() {`);
js = js.replace('body: JSON.stringify(payload),', 'body: JSON.stringify(toWixShape(payload, a)),');

// payload: remove o tracking do template (Wix não tem UTMCapture) e fixa Fonte/origem do site
js = js.replace(/const trackingRaw[\s\S]*?const pageSource = [^\n]*\n/, `const tracking = {};\n    const pageSource = ${JSON.stringify(CONFIG.fonte)};\n`);
js = js.replace(/    \/\/ _fbp\/_fbc lidos agora[\s\S]*?payload\.origem = detectOrigem\(tracking\);\n/, `    payload.origem = ${JSON.stringify(CONFIG.origem)};\n    payload.landing_page = window.location.pathname;\n    if (document.referrer) payload.referrer = document.referrer;\n`);
js = js.replace("form_id: 'form_whatsapp',\n      form_name: 'form_whatsapp',", "form_id: 'form_whatsapp_site',\n      form_name: 'form_whatsapp_site',");
// espelho GTM (removido do markup)
js = js.replace(/    \/\/ preenche o espelho antes do push[\s\S]*?    \}\n\n    window\.dataLayer = window\.dataLayer \|\| \[\];\n    window\.dataLayer\.push\(\{\n      event: 'form_submit'/, "    window.dataLayer = window.dataLayer || [];\n    window.dataLayer.push({\n      event: 'form_submit'");
js = js.replace(/form_id: 'form_whatsapp'/g, "form_id: 'form_whatsapp_site'").replace(/form_name: 'form_whatsapp'/g, "form_name: 'form_whatsapp_site'");

const vars = `const submitUrl=${JSON.stringify(CONFIG.submitUrl)},project=${JSON.stringify(CONFIG.project)},trackingParamKeys=[],phone=${JSON.stringify(CONFIG.phone)},avatar=${JSON.stringify(CONFIG.avatar)},introMessages=${JSON.stringify(introMessages)},fields=${JSON.stringify(fields)};\n`;

const out = `/* L'Espai — popup de WhatsApp (padrão Dmove) para o site Wix. Gerado por tools/build-wa-embed.mjs — não edite à mão. */
(function () {
  if (window.__lespaiWaLoaded) return;
  window.__lespaiWaLoaded = true;
  function boot() {
    var style = document.createElement('style');
    style.textContent = ${JSON.stringify(css)};
    document.head.appendChild(style);
    var host = document.createElement('div');
    host.innerHTML = ${JSON.stringify(markup)};
    document.body.appendChild(host.firstElementChild);
    (function () {
${vars}${js}
    })();
    // Calendário (flatpickr via CDN) no campo de data
    function loadScript(u, cb) { var s = document.createElement('script'); s.src = u; s.onload = cb; document.head.appendChild(s); }
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css'; document.head.appendChild(l);
    loadScript('https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js', function () {
      loadScript('https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/l10n/pt.js', function () {
        var el = document.querySelector('[data-wa-flatpickr]');
        if (!el || !window.flatpickr) return;
        var fp = window.flatpickr(el, {
          locale: window.flatpickr.l10ns.pt, dateFormat: 'd/m/Y', minDate: 'today', disableMobile: false, allowInput: true,
          onOpen: function () { window.__waCalendarOpen = true; },
          onClose: function () { setTimeout(function () { window.__waCalendarOpen = false; }, 250); }
        });
        var icon = document.getElementById('wa-date-icon');
        if (icon) icon.addEventListener('click', function () { fp.open(); });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
`;
fs.writeFileSync('public/embed/lespai-wa-widget.js', out);
console.log('ok', out.length, 'bytes;', tipos.length, 'tipos');
