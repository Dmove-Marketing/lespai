/* L'Espai — popup de WhatsApp (padrão Dmove) para o site Wix. Gerado por tools/build-wa-embed.mjs — não edite à mão. */
(function () {
  if (window.__lespaiWaLoaded) return;
  window.__lespaiWaLoaded = true;
  function boot() {
    var style = document.createElement('style');
    style.textContent = "#wa-widget{font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif}\n#wa-widget *{box-sizing:border-box}\n\n  /* ── Variáveis ──────────────────────────────── */\n  :root {\n    --wa-green:      #25D366;\n    --wa-green-dark: #128C7E;\n    --wa-primary:    #075E54;   /* cor primária: header e balão do usuário */\n    --wa-bg:         #ECE5DD;   /* fundo clássico do chat */\n    --wa-text:       #222;\n    --wa-subtext:    #667781;\n    --wa-border:     #e5e7eb;\n    --wa-error:      #e53e3e;\n  }\n\n  #wa-widget { display: contents; }\n  #wa-widget [hidden] { display: none !important; }\n\n  /* O calendário (flatpickr) é anexado ao <body> com z-index padrão (~99999),\n     que fica atrás do popup (2147482999) — precisa flutuar acima dele */\n  .flatpickr-calendar { z-index: 2147483001 !important; }\n\n  /* ── Botão flutuante ────────────────────────── */\n  .wa-fab {\n    position: fixed;\n    bottom: 24px;\n    right: 20px;\n    z-index: 2147483000;\n    width: 58px;\n    height: 58px;\n    border-radius: 50%;\n    background: var(--wa-green);\n    color: #fff;\n    border: none;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    box-shadow: 0 4px 20px rgba(37,211,102,.45), 0 2px 8px rgba(0,0,0,.25);\n    transition: transform .15s, box-shadow .2s;\n  }\n  .wa-fab:hover {\n    transform: scale(1.08);\n    box-shadow: 0 6px 28px rgba(37,211,102,.55), 0 4px 12px rgba(0,0,0,.28);\n  }\n  .wa-fab:active { transform: scale(.96); }\n\n  .wa-fab::before {\n    content: '';\n    position: absolute;\n    inset: -4px;\n    border-radius: 50%;\n    background: rgba(37,211,102,.3);\n    animation: wa-pulse 2.4s ease-out infinite;\n  }\n  @keyframes wa-pulse {\n    0%   { transform: scale(1); opacity: .6; }\n    70%  { transform: scale(1.45); opacity: 0; }\n    100% { opacity: 0; }\n  }\n\n  .wa-fab__badge {\n    position: absolute;\n    top: 2px;\n    right: 2px;\n    background: #FF3B30;\n    color: #fff;\n    font-size: .65rem;\n    font-weight: 700;\n    font-family: inherit;\n    width: 18px;\n    height: 18px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    border: 2px solid #fff;\n  }\n\n  /* ── Teaser ─────────────────────────────────── */\n  .wa-teaser {\n    position: fixed;\n    bottom: 94px;\n    right: 20px;\n    z-index: 2147482998;\n    max-width: 270px;\n    opacity: 0;\n    transform: translateY(10px);\n    transition: opacity .22s ease, transform .22s ease;\n  }\n  .wa-teaser--in { opacity: 1; transform: translateY(0); }\n  .wa-teaser__bubble {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    background: #fff;\n    border: none;\n    border-radius: 12px;\n    padding: 10px 14px;\n    box-shadow: 0 4px 16px rgba(0,0,0,.15);\n    cursor: pointer;\n    text-align: left;\n    transition: transform .15s, box-shadow .15s;\n    position: relative;\n  }\n  .wa-teaser__bubble::after {\n    content: '';\n    position: absolute;\n    bottom: -6px;\n    right: 20px;\n    width: 12px;\n    height: 12px;\n    background: #fff;\n    transform: rotate(45deg);\n    box-shadow: 2px 2px 4px rgba(0,0,0,.08);\n  }\n  .wa-teaser__bubble:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 8px 24px rgba(0,0,0,.2);\n  }\n  .wa-teaser__avatar {\n    width: 36px;\n    height: 36px;\n    border-radius: 50%;\n    object-fit: cover;\n    flex-shrink: 0;\n    background: #fff;\n    border: 1px solid #eee;\n  }\n  .wa-teaser__text {\n    font-family: inherit;\n    font-size: 13px;\n    color: #333;\n    line-height: 1.4;\n  }\n  .wa-teaser__text strong {\n    display: block;\n    font-size: 12px;\n    color: var(--wa-primary);\n    margin-bottom: 1px;\n  }\n  .wa-teaser__close {\n    position: absolute;\n    top: -8px;\n    left: -8px;\n    width: 22px;\n    height: 22px;\n    border-radius: 50%;\n    border: none;\n    background: #fff;\n    color: var(--wa-subtext);\n    box-shadow: 0 2px 8px rgba(0,0,0,.18);\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 1;\n    transition: color .15s, transform .15s;\n  }\n  .wa-teaser__close:hover { color: var(--wa-text); transform: scale(1.1); }\n\n  /* ── Popup ──────────────────────────────────── */\n  .wa-popup {\n    position: fixed;\n    bottom: 94px;\n    right: 20px;\n    z-index: 2147482999;\n    width: 340px;\n    height: min(540px, calc(100dvh - 130px));\n    max-width: calc(100vw - 32px);\n    background: #fff;\n    border-radius: 16px;\n    box-shadow: 0 8px 32px rgba(0,0,0,.18);\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n    transform: translateY(16px) scale(.96);\n    opacity: 0;\n    transition: transform .28s cubic-bezier(.16,1,.3,1), opacity .25s ease;\n    pointer-events: none;\n  }\n  .wa-popup--open {\n    transform: translateY(0) scale(1);\n    opacity: 1;\n    pointer-events: auto;\n  }\n\n  /* Header */\n  .wa-header {\n    background: var(--wa-primary);\n    padding: 12px 14px;\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    color: #fff;\n    flex-shrink: 0;\n  }\n  .wa-header__avatar {\n    position: relative;\n    flex-shrink: 0;\n    width: 40px;\n    height: 40px;\n  }\n  .wa-header__avatar-fallback {\n    position: absolute;\n    inset: 0;\n    border-radius: 50%;\n    background: var(--wa-green-dark);\n    color: #fff;\n    font-family: inherit;\n    font-size: 18px;\n    font-weight: 600;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n  .wa-header__avatar-img {\n    position: absolute;\n    inset: 0;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    object-fit: cover;\n    display: block;\n    background: #fff;\n    box-shadow: 0 0 0 2px rgba(255,255,255,.3);\n  }\n  .wa-header__status {\n    position: absolute;\n    bottom: 0;\n    right: 0;\n    width: 10px;\n    height: 10px;\n    background: #4ade80;\n    border-radius: 50%;\n    border: 2px solid var(--wa-primary);\n    z-index: 1;\n  }\n  .wa-header__info {\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n    gap: 2px;\n    min-width: 0;\n  }\n  .wa-header__info strong {\n    font-size: 14px;\n    font-family: inherit;\n    font-weight: 500;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    display: flex;\n    align-items: center;\n    gap: 5px;\n  }\n  .wa-header__verified {\n    flex-shrink: 0;\n    background: #fff;\n    border-radius: 50%;\n  }\n  .wa-header__presence {\n    font-size: 11px;\n    color: #a7f3d0;\n    font-family: inherit;\n    display: flex;\n    align-items: center;\n    gap: 5px;\n  }\n  .wa-header__presence-dot {\n    width: 6px;\n    height: 6px;\n    border-radius: 50%;\n    background: #4ade80;\n    animation: wa-presence 2s ease-in-out infinite;\n  }\n  @keyframes wa-presence {\n    0%, 100% { opacity: 1; }\n    50%      { opacity: .4; }\n  }\n  .wa-header__close {\n    background: none;\n    border: none;\n    color: #a7f3d0;\n    cursor: pointer;\n    padding: 4px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    transition: color .15s, background .15s;\n    flex-shrink: 0;\n  }\n  .wa-header__close:hover { background: rgba(255,255,255,.12); color: #fff; }\n\n  /* ── Área de chat ───────────────────────────── */\n  .wa-chat {\n    flex: 1;\n    overflow-y: auto;\n    padding: 14px 12px;\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n    background: var(--wa-bg);\n    scroll-behavior: smooth;\n    overscroll-behavior: contain;\n    -webkit-overflow-scrolling: touch;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23ECE5DD'/%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%23D5CCC4' opacity='.5'/%3E%3Ccircle cx='30' cy='10' r='1.5' fill='%23D5CCC4' opacity='.5'/%3E%3Ccircle cx='50' cy='10' r='1.5' fill='%23D5CCC4' opacity='.5'/%3E%3Ccircle cx='20' cy='30' r='1.5' fill='%23D5CCC4' opacity='.5'/%3E%3Ccircle cx='40' cy='30' r='1.5' fill='%23D5CCC4' opacity='.5'/%3E%3Ccircle cx='10' cy='50' r='1.5' fill='%23D5CCC4' opacity='.5'/%3E%3Ccircle cx='30' cy='50' r='1.5' fill='%23D5CCC4' opacity='.5'/%3E%3Ccircle cx='50' cy='50' r='1.5' fill='%23D5CCC4' opacity='.5'/%3E%3C/svg%3E\");\n  }\n  .wa-chat::-webkit-scrollbar { width: 4px; }\n  .wa-chat::-webkit-scrollbar-track { background: transparent; }\n  .wa-chat::-webkit-scrollbar-thumb { background: #bbb; border-radius: 4px; }\n\n  /* Linhas e balões (criados via JS — usar :global) */\n  .wa-chat .wa-row {\n    display: flex;\n    align-items: flex-end;\n    gap: 8px;\n    animation: wa-bubble-in .3s ease forwards;\n  }\n  .wa-chat .wa-row--instant { animation: none; }\n  .wa-chat .wa-row--user { justify-content: flex-end; }\n  @keyframes wa-bubble-in {\n    from { opacity: 0; transform: translateY(6px); }\n    to   { opacity: 1; transform: translateY(0); }\n  }\n\n  .wa-chat .wa-row__avatar {\n    width: 24px;\n    height: 24px;\n    border-radius: 50%;\n    object-fit: cover;\n    background: #fff;\n    flex-shrink: 0;\n  }\n\n  .wa-chat .wa-msg {\n    font-family: inherit;\n    font-size: 13px;\n    line-height: 1.5;\n    padding: 9px 13px;\n    max-width: 230px;\n    word-wrap: break-word;\n  }\n  .wa-chat .wa-row--agent .wa-msg {\n    background: #fff;\n    color: var(--wa-text);\n    border-radius: 12px 12px 12px 2px;\n    box-shadow: 0 1px 2px rgba(0,0,0,.08);\n  }\n  .wa-chat .wa-row--user .wa-msg {\n    background: var(--wa-primary);\n    color: #fff;\n    border-radius: 12px 12px 2px 12px;\n    box-shadow: 0 1px 2px rgba(0,0,0,.12);\n  }\n\n  /* Indicador \"digitando\" */\n  .wa-chat .wa-typing {\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    padding: 12px 14px;\n  }\n  .wa-chat .wa-dot {\n    width: 7px;\n    height: 7px;\n    border-radius: 50%;\n    background: #aaa;\n    animation: wa-dot-bounce 1s ease-in-out infinite;\n  }\n  .wa-chat .wa-dot:nth-child(2) { animation-delay: .15s; }\n  .wa-chat .wa-dot:nth-child(3) { animation-delay: .3s; }\n  @keyframes wa-dot-bounce {\n    0%, 60%, 100% { transform: translateY(0); }\n    30%           { transform: translateY(-5px); }\n  }\n\n  /* CTA final dentro de balão */\n  .wa-chat .wa-cta {\n    display: inline-flex;\n    align-items: center;\n    gap: 7px;\n    background: var(--wa-green);\n    color: #fff;\n    font-weight: 600;\n    font-size: 13px;\n    padding: 9px 16px;\n    border-radius: 20px;\n    text-decoration: none;\n    transition: background .2s;\n  }\n  .wa-chat .wa-cta:hover { background: var(--wa-green-dark); }\n  .wa-chat .wa-row .wa-msg:has(.wa-cta) {\n    background: transparent;\n    box-shadow: none;\n    padding: 2px 0;\n  }\n\n  /* ── Barra de input ─────────────────────────── */\n  .wa-inputbar {\n    background: #fff;\n    border-top: .5px solid var(--wa-border);\n    padding: 10px 12px 12px;\n    flex-shrink: 0;\n    animation: wa-bubble-in .25s ease;\n  }\n  .wa-inputbar__label {\n    display: block;\n    font-family: inherit;\n    font-size: 11px;\n    color: #888;\n    margin-bottom: 6px;\n  }\n  .wa-inputbar__row {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n  }\n  .wa-input {\n    flex: 1;\n    min-width: 0;\n    border: 1px solid var(--wa-border);\n    border-radius: 20px;\n    padding: 8px 14px;\n    font-family: inherit;\n    font-size: 13px;\n    color: var(--wa-text);\n    transition: border-color .2s, box-shadow .2s;\n  }\n  .wa-input:focus {\n    outline: none;\n    border-color: var(--wa-primary);\n    box-shadow: 0 0 0 3px rgba(7,94,84,.1);\n  }\n  .wa-input::placeholder { color: #aaa; }\n  .wa-inputbar__row--error .wa-input { border-color: var(--wa-error); }\n\n  .wa-datefield {\n    position: relative;\n    flex: 1;\n    display: flex;\n    align-items: center;\n  }\n  .wa-datefield .flatpickr-wrapper {\n    display: block;\n    width: 100%;\n  }\n  /* input nativo de data criado pelo flatpickr no mobile (sem escopo Astro) */\n  .wa-datefield .flatpickr-mobile {\n    flex: 1;\n    width: 100%;\n    min-width: 0;\n    border: 1px solid var(--wa-border);\n    border-radius: 20px;\n    padding: 8px 34px 8px 14px;\n    font-family: inherit;\n    font-size: 16px;\n    color: var(--wa-text);\n    background: #fff;\n    appearance: none;\n    -webkit-appearance: none;\n  }\n  .wa-datefield .flatpickr-mobile:focus {\n    outline: none;\n    border-color: var(--wa-primary);\n    box-shadow: 0 0 0 3px rgba(7,94,84,.1);\n  }\n  /* o input nativo já tem o próprio indicador de calendário — esconde o nosso */\n  .wa-datefield:has(.flatpickr-mobile) .wa-datefield__icon { display: none; }\n  .wa-datefield .wa-input {\n    width: 100%;\n    padding-right: 34px;\n    cursor: pointer;\n  }\n  .wa-datefield__icon {\n    position: absolute;\n    right: 12px;\n    top: 50%;\n    transform: translateY(-50%);\n    color: var(--wa-primary);\n    opacity: .6;\n    cursor: pointer;\n    transition: opacity .2s;\n  }\n  .wa-datefield:focus-within .wa-datefield__icon,\n  .wa-datefield__icon:hover { opacity: 1; }\n\n  .wa-send {\n    width: 36px;\n    height: 36px;\n    border-radius: 50%;\n    border: none;\n    background: var(--wa-primary);\n    color: #fff;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n    transition: transform .15s, background .2s;\n  }\n  .wa-send:hover { background: var(--wa-green-dark); transform: scale(1.06); }\n  .wa-send:active { transform: scale(.94); }\n\n  .wa-inputbar__error {\n    font-family: inherit;\n    font-size: 11px;\n    color: var(--wa-error);\n    margin: 5px 2px 0;\n  }\n\n  /* Chips (seleção única / sugestões) — criados via JS, precisam de :global */\n  .wa-chips {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 6px;\n    margin-bottom: 8px;\n    max-height: 132px;\n    overflow-y: auto;\n    padding: 2px;\n  }\n  .wa-chips::-webkit-scrollbar { width: 4px; }\n  .wa-chips::-webkit-scrollbar-track { background: transparent; }\n  .wa-chips::-webkit-scrollbar-thumb { background: #bbb; border-radius: 4px; }\n  .wa-chips .wa-chip {\n    padding: 6px 14px;\n    border-radius: 16px;\n    font-family: inherit;\n    font-size: 13px;\n    border: 1px solid var(--wa-primary);\n    background: transparent;\n    color: var(--wa-primary);\n    cursor: pointer;\n    transition: background .15s, color .15s;\n  }\n  .wa-chips .wa-chip:hover {\n    background: var(--wa-primary);\n    color: #fff;\n  }\n\n  /* ── Acessibilidade: movimento reduzido ─────── */\n  @media (prefers-reduced-motion: reduce) {\n    .wa-fab::before,\n    .wa-header__presence-dot { animation: none; }\n    .wa-chat .wa-row,\n    .wa-chat .wa-dot,\n    .wa-inputbar { animation: none; }\n    .wa-popup,\n    .wa-teaser,\n    .wa-fab { transition-duration: .01s; }\n  }\n\n  /* ── Responsivo ─────────────────────────────── */\n  @media (max-width: 768px) {\n    .wa-fab {\n      bottom: calc(18px + env(safe-area-inset-bottom, 0px));\n      right: 14px;\n    }\n    .wa-popup {\n      left: 12px;\n      right: 12px;\n      width: auto;\n      max-width: none;\n      bottom: calc(86px + env(safe-area-inset-bottom, 0px));\n      height: calc(100dvh - 110px);\n      max-height: 560px;\n      border-radius: 14px;\n    }\n    .wa-teaser {\n      bottom: calc(88px + env(safe-area-inset-bottom, 0px));\n      right: 14px;\n      max-width: calc(100vw - 90px);\n    }\n    .wa-chat .wa-msg { max-width: 75%; }\n\n    /* fonte ≥16px evita o zoom automático do iOS ao focar o input */\n    .wa-input {\n      font-size: 16px;\n      padding: 10px 16px;\n    }\n    .wa-datefield .wa-input { padding-right: 38px; }\n    /* alvos de toque confortáveis (mínimo 44px recomendado) */\n    .wa-send {\n      width: 44px;\n      height: 44px;\n    }\n    .wa-chips .wa-chip {\n      padding: 9px 16px;\n      font-size: 14px;\n    }\n    .wa-inputbar { padding: 10px 12px calc(12px + env(safe-area-inset-bottom, 0px) / 2); }\n    .wa-header__close { padding: 10px; }\n  }\n";
    document.head.appendChild(style);
    var host = document.createElement('div');
    host.innerHTML = "<div id=\"wa-widget\" aria-label=\"Fale pelo WhatsApp\">\n\n  \n  <div id=\"wa-teaser\" class=\"wa-teaser\" hidden>\n    <button class=\"wa-teaser__close\" id=\"wa-teaser-close\" aria-label=\"Dispensar mensagem\">\n      <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" width=\"12\" height=\"12\"><path d=\"M18 6L6 18M6 6l12 12\"/></svg>\n    </button>\n    <button class=\"wa-teaser__bubble\" id=\"wa-teaser-open\">\n      <img class=\"wa-teaser__avatar\" src=\"https://media.dmove.com.br/clients/lespai/photos/favicon.webp\" alt=\"\" width=\"36\" height=\"36\" loading=\"lazy\" onerror=\"this.style.visibility='hidden'\" />\n      <span class=\"wa-teaser__text\">\n        <strong>L'Espai Banqueteria</strong>\n        Olá! 👋 Quer um orçamento para o seu evento?\n      </span>\n    </button>\n  </div>\n\n  \n  <button id=\"wa-toggle\" class=\"wa-fab\" aria-label=\"Abrir chat WhatsApp\" aria-expanded=\"false\">\n    <svg viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"28\" height=\"28\" aria-hidden=\"true\">\n      <path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z\"/>\n      <path d=\"M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.852L.057 23.428a.5.5 0 0 0 .614.614l5.576-1.475A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.49-5.178-1.348l-.372-.214-3.862 1.022 1.022-3.732-.228-.384A9.945 9.945 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z\"/>\n    </svg>\n    <span class=\"wa-fab__badge\" id=\"wa-badge\">1</span>\n  </button>\n\n  \n  <div id=\"wa-popup\" class=\"wa-popup\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Chat WhatsApp\" hidden>\n\n    \n    <div class=\"wa-header\">\n      <div class=\"wa-header__avatar\">\n        <span class=\"wa-header__avatar-fallback\" aria-hidden=\"true\">L</span>\n        <img class=\"wa-header__avatar-img\" src=\"https://media.dmove.com.br/clients/lespai/photos/favicon.webp\" alt=\"\" width=\"40\" height=\"40\" loading=\"lazy\" onerror=\"this.remove()\" />\n        <span class=\"wa-header__status\" aria-hidden=\"true\"></span>\n      </div>\n      <div class=\"wa-header__info\">\n        <strong>\n          L'Espai Banqueteria\n          <svg class=\"wa-header__verified\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-label=\"Conta verificada\">\n            <path fill=\"#25D366\" d=\"M12 1l2.6 2.2 3.4-.4 1.2 3.2 3 1.7-.8 3.3 2 2.7-2 2.7.8 3.3-3 1.7-1.2 3.2-3.4-.4L12 26l-2.6-2.2-3.4.4-1.2-3.2-3-1.7.8-3.3-2-2.7 2-2.7-.8-3.3 3-1.7L7.9 2.8l3.4.4z\" transform=\"scale(.88) translate(1.5 -1)\"/>\n            <path fill=\"#fff\" d=\"M10.4 15.9l-3-3 1.3-1.3 1.7 1.7 4.9-4.9 1.3 1.3z\"/>\n          </svg>\n        </strong>\n        <span class=\"wa-header__presence\"><span class=\"wa-header__presence-dot\"></span> Online</span>\n      </div>\n      <button class=\"wa-header__close\" id=\"wa-close\" aria-label=\"Fechar chat\">\n        <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" width=\"18\" height=\"18\">\n          <path d=\"M18 6L6 18M6 6l12 12\"/>\n        </svg>\n      </button>\n    </div>\n\n    \n    <div class=\"wa-chat\" id=\"wa-chat\" role=\"log\" aria-live=\"polite\"></div>\n\n    \n    <div class=\"wa-inputbar\" id=\"wa-inputbar\" hidden>\n      <label class=\"wa-inputbar__label\" id=\"wa-inputbar-label\" for=\"wa-input\"></label>\n\n      \n      <div class=\"wa-chips\" id=\"wa-chips\" hidden></div>\n\n      <div class=\"wa-inputbar__row\" id=\"wa-inputbar-row\">\n        <input id=\"wa-input\" class=\"wa-input\" type=\"text\" autocomplete=\"off\" />\n        <div class=\"wa-datefield\" id=\"wa-datefield\" hidden>\n          <input id=\"wa-input-date\" class=\"wa-input\" type=\"text\" placeholder=\"dd/mm/aaaa\" autocomplete=\"off\" inputmode=\"numeric\" maxlength=\"10\" data-wa-flatpickr=\"true\" />\n          <svg class=\"wa-datefield__icon\" id=\"wa-date-icon\" width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n            <rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"3\"></rect>\n            <line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line>\n            <line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line>\n            <line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line>\n          </svg>\n        </div>\n        <button class=\"wa-send\" id=\"wa-send\" aria-label=\"Enviar resposta\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" width=\"16\" height=\"16\"><path d=\"M12 19V5M5 12l7-7 7 7\"/></svg>\n        </button>\n      </div>\n      <p class=\"wa-inputbar__error\" id=\"wa-error\" role=\"alert\" hidden></p>\n    </div>\n  </div>\n\n  \n  \n</div>\n\n";
    document.body.appendChild(host.firstElementChild);
    (function () {
const submitUrl="https://server3n8n.dmove.com.br/webhook/lespai",project="lespai-site",trackingParamKeys=[],phone="5511961882002",avatar="https://media.dmove.com.br/clients/lespai/photos/favicon.webp",introMessages=["Olá! 👋 Bem-vindo(a) à L'Espai Banqueteria.","Vou te fazer algumas perguntas rápidas para preparar o seu orçamento, tudo bem?"],fields=[{"key":"nome","type":"text","label":"Pra começar, qual é o seu nome? 😊","placeholder":"Seu nome"},{"key":"tel","type":"phone","label":"Qual é o seu WhatsApp com DDD?","placeholder":"(11) 99999-9999"},{"key":"email","type":"email","label":"E o seu e-mail?","placeholder":"seu@email.com"},{"key":"tipo_evento","type":"select","label":"Que tipo de evento você quer celebrar? 🥂","options":[{"value":"Aniversario","label":"Aniversário"},{"value":"Aniversario debutante","label":"Aniversário debutante"},{"value":"Bodas","label":"Bodas"},{"value":"Casamento","label":"Casamento"},{"value":"Confraternizacao corporativa","label":"Confraternização corporativa"},{"value":"Confraternizacao social","label":"Confraternização social"},{"value":"Convencoes e kick-offs","label":"Convenções e kick-offs"},{"value":"Corporativo","label":"Corporativo"},{"value":"Feiras e Exposicoes","label":"Feiras e Exposições"},{"value":"Lancamentos de produtos","label":"Lançamentos de produtos"},{"value":"Masterclass e Palestras","label":"Masterclass e Palestras"},{"value":"Mentorias e Treinamentos","label":"Mentorias e Treinamentos"},{"value":"Offsite corporativo","label":"Offsite corporativo"},{"value":"Plenarias e treinamentos","label":"Plenárias e treinamentos"},{"value":"Reunioes de Networking","label":"Reuniões de Networking"},{"value":"Reunioes executivas","label":"Reuniões executivas"},{"value":"Roadshows e ativacoes","label":"Roadshows e ativações"},{"value":"Workshops, Conferencias e Seminarios","label":"Workshops, Conferências e Seminários"},{"value":"Outros","label":"Outros"}]},{"key":"data_evento","type":"date","label":"Qual é a data prevista do evento? 📅","placeholder":"dd/mm/aaaa"},{"key":"convidados","type":"number","label":"E quantos convidados, aproximadamente?","placeholder":"Ex: 150","chips":["50","100","150","200","300"]}];

  /* ── Elementos ─────────────────────────────── */
  const toggle    = document.getElementById('wa-toggle');
  const popup     = document.getElementById('wa-popup');
  const closeBtn  = document.getElementById('wa-close');
  const badge     = document.getElementById('wa-badge');
  const chat      = document.getElementById('wa-chat');
  const inputbar  = document.getElementById('wa-inputbar');
  const inputLbl  = document.getElementById('wa-inputbar-label');
  const inputRow  = document.getElementById('wa-inputbar-row');
  const input     = document.getElementById('wa-input');
  const dateField = document.getElementById('wa-datefield');
  const dateInput = document.getElementById('wa-input-date');
  const chipsBox  = document.getElementById('wa-chips');
  const sendBtn   = document.getElementById('wa-send');
  const errorEl   = document.getElementById('wa-error');
  const teaser    = document.getElementById('wa-teaser');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  /* ── Estado da conversa (persistido na sessão) ── */
  const STATE_KEY = 'wa_convo';
  let state = { answers: {}, idx: 0, done: false };
  try {
    const saved = JSON.parse(sessionStorage.getItem(STATE_KEY) || 'null');
    if (saved && typeof saved.idx === 'number') state = saved;
  } catch (_) {}
  const saveState = () => { try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (_) {} };

  /* ── Balões ─────────────────────────────────── */
  function scrollChat() {
    setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 50);
  }

  function bubble(who, text, instant) {
    const row = document.createElement('div');
    row.className = `wa-row wa-row--${who}` + (instant ? ' wa-row--instant' : '');
    if (who === 'agent') {
      const img = document.createElement('img');
      img.className = 'wa-row__avatar';
      img.src = avatar;
      img.alt = '';
      img.width = 24; img.height = 24;
      img.onerror = () => { img.style.visibility = 'hidden'; };
      row.appendChild(img);
    }
    const b = document.createElement('div');
    b.className = 'wa-msg';
    b.textContent = text;
    row.appendChild(b);
    chat.appendChild(row);
    scrollChat();
    return row;
  }

  function bubbleHtml(who, node) {
    const row = document.createElement('div');
    row.className = `wa-row wa-row--${who}`;
    const b = document.createElement('div');
    b.className = 'wa-msg';
    b.appendChild(node);
    row.appendChild(b);
    chat.appendChild(row);
    scrollChat();
    return row;
  }

  let typingRow = null;
  function setTyping(on) {
    if (on && !typingRow) {
      typingRow = document.createElement('div');
      typingRow.className = 'wa-row wa-row--agent';
      typingRow.innerHTML = `<img class="wa-row__avatar" src="${avatar}" alt="" width="24" height="24">
        <div class="wa-msg wa-typing"><span class="wa-dot"></span><span class="wa-dot"></span><span class="wa-dot"></span></div>`;
      chat.appendChild(typingRow);
      scrollChat();
    } else if (!on && typingRow) {
      typingRow.remove();
      typingRow = null;
    }
  }

  /* ── Máscaras ───────────────────────────────── */
  function maskPhone(v) {
    let d = v.replace(/\D/g, '');
    if (d.startsWith('55') && d.length > 11) d = d.slice(2);
    d = d.slice(0, 11);
    if (d.length > 7) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return d.length ? `(${d}` : '';
  }
  function maskDate(v) {
    let d = v.replace(/\D/g, '').slice(0, 8);
    if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return d;
  }

  /* ── Validação ──────────────────────────────── */
  function validate(field, value) {
    const v = value.trim();
    if (!v) return 'Campo obrigatório';
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Digite um e-mail válido';
    if (field.type === 'phone') {
      const d = v.replace(/\D/g, '');
      if (d.startsWith('55') && d.length > 11) return 'Não coloque o DDI 55. Informe apenas DDD + número.';
      if (d.length < 10) return 'Digite um telefone válido com DDD';
    }
    if (field.type === 'date' && !/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return 'Digite a data no formato dd/mm/aaaa';
    if (field.type === 'number' && !/^\d+\+?$/.test(v)) return 'Digite um número';
    return null;
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    inputRow.classList.add('wa-inputbar__row--error');
  }
  function clearError() {
    errorEl.hidden = true;
    inputRow.classList.remove('wa-inputbar__row--error');
  }

  /* ── Input ativo ────────────────────────────── */
  let activeResolve = null;
  let activeField = null;

  function showInput(field) {
    activeField = field;
    inputbar.hidden = false;
    inputLbl.textContent = field.label.replace(/\s*[😊🥂📅]\s*/g, '');
    clearError();

    const isDate = field.type === 'date';
    const isSelect = field.type === 'select';

    input.hidden = isDate || isSelect;
    dateField.hidden = !isDate;
    inputRow.hidden = isSelect;
    sendBtn.hidden = isSelect;

    // chips: opções de seleção única ou sugestões numéricas
    chipsBox.innerHTML = '';
    const chips = isSelect ? field.options : (field.chips || []).map((c) => ({ value: c, label: c === '300' ? '300+' : c }));
    if (chips && chips.length) {
      chipsBox.hidden = false;
      chips.forEach((o) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wa-chip';
        btn.textContent = o.label;
        btn.addEventListener('click', () => submitAnswer(o.value, o.label));
        chipsBox.appendChild(btn);
      });
    } else {
      chipsBox.hidden = true;
    }

    if (!isSelect) {
      const el = isDate ? dateInput : input;
      el.value = '';
      el.placeholder = field.placeholder || '';
      if (!isDate) {
        input.type = 'text';
        input.inputMode = field.type === 'phone' || field.type === 'number' ? 'numeric' : (field.type === 'email' ? 'email' : 'text');
        input.autocomplete = { nome: 'name', tel: 'tel', email: 'email', empresa: 'organization' }[field.key] || 'off';
      }
      setTimeout(() => el.focus({ preventScroll: true }), 100);
    }
    scrollChat();
  }

  function hideInput() {
    inputbar.hidden = true;
    activeField = null;
  }

  function submitAnswer(value, display) {
    if (!activeResolve) return;
    const err = validate(activeField, String(value));
    if (err) { showError(err); return; }
    clearError();
    const r = activeResolve;
    activeResolve = null;
    hideInput();
    r({ value: String(value).trim(), display: (display || String(value)).trim() });
  }

  function currentInputEl() {
    return activeField?.type === 'date' ? dateInput : input;
  }

  sendBtn.addEventListener('click', () => {
    if (activeField) submitAnswer(currentInputEl().value);
  });
  [input, dateInput].forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && activeField) {
        e.preventDefault();
        submitAnswer(el.value);
      }
    });
    el.addEventListener('input', clearError);
  });
  input.addEventListener('input', () => {
    if (activeField?.type === 'phone') input.value = maskPhone(input.value);
    if (activeField?.type === 'number') input.value = input.value.replace(/\D/g, '').slice(0, 5);
  });
  dateInput.addEventListener('input', () => { dateInput.value = maskDate(dateInput.value); });

  /* ── Roteiro da conversa ────────────────────── */
  function waMessage() {
    const a = state.answers;
    const tipo = a.tipo_evento?.display || 'meu evento';
    const parts = [`Olá! Sou ${a.nome?.display || ''}`.trim()];
    if (a.empresa) parts[0] += `, da empresa ${a.empresa.display}`;
    parts.push(`Gostaria de um orçamento para ${tipo.toLowerCase()}`);
    if (a.data_evento) parts[parts.length - 1] += ` no dia ${a.data_evento.display}`;
    if (a.convidados) parts[parts.length - 1] += `, para aproximadamente ${a.convidados.display} convidados`;
    return `${parts.join('. ')}. 🥂`;
  }
  const waUrl = () => `https://wa.me/${phone}?text=${encodeURIComponent(waMessage())}`;

  function ctaBubble() {
    const link = document.createElement('a');
    link.className = 'wa-cta';
    link.href = waUrl();
    link.target = '_blank';
    link.rel = 'noopener';
    // depois do lead: só GA4 (não é Contact, a pessoa já virou Lead)
    link.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'whatsapp_click', click_type: 'continuar_conversa', link_location: 'popup', project: project });
    });
    link.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.852L.057 23.428a.5.5 0 0 0 .614.614l5.576-1.475A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg> Continuar no WhatsApp`;
    bubbleHtml('agent', link);
  }

  async function agentSays(text, typingMs) {
    setTyping(true);
    await wait(typingMs || 700);
    setTyping(false);
    bubble('agent', text);
    await wait(350);
  }

  function detectOrigem(tr) {
    const s = (tr.utm_source || '').toLowerCase();
    const m = (tr.utm_medium || '').toLowerCase();
    const organico = /^(social|organic|organico|orgânico|bio|referral|email)$/.test(m) || /bio/.test((tr.utm_content || '').toLowerCase());
    if (tr.gclid || tr.gbraid || tr.wbraid) return 'Google';
    if (tr.ttclid) return 'TikTok';
    if (tr.fbclid) return 'Meta';
    if (!organico) {
      if (/^(google|adwords|googleads|google-ads|gads)$/.test(s)) return 'Google';
      if (/^(meta|facebook|fb|ig|instagram|an|msg|messenger)$/.test(s)) return 'Meta';
      if (/tiktok/.test(s)) return 'TikTok';
      if (/linkedin/.test(s)) return 'LinkedIn';
      if (/youtube/.test(s)) return 'YouTube';
      if (/pinterest/.test(s)) return 'Pinterest';
    }
    return 'Orgânico';
  }

  async function submitLead() {
    const a = state.answers;
    const tracking = {};
    const pageSource = "Site";

    const now = new Date();
    const payload = {
      ...(a.empresa ? { Empresa: a.empresa.value } : {}),
      Nome: a.nome?.value || '',
      WhatsApp: a.tel?.value || '',
      'E-mail': a.email?.value || '',
      'Data do evento': a.data_evento?.value || '',
      Convidados: a.convidados?.value || '',
      'Tipo de evento': a.tipo_evento?.value || '',
      Fonte: pageSource,
      Data: now.toLocaleDateString('pt-BR'),
      'Horário': now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      'URL da página': window.location.href,
      'Agente de usuário': navigator.userAgent,
      'Desenvolvido por': 'Dmove',
      form_id: 'form_whatsapp_site',
      form_name: 'form_whatsapp_site',
    };
    payload.origem = "Orgânico";
    payload.landing_page = window.location.pathname;
    if (document.referrer) payload.referrer = document.referrer;

    try {
      if (submitUrl) {
        await fetch(submitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      }
    } catch (_) { /* falha silenciosa */ }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'form_submit',
      form_source: 'whatsapp',
      form_id: 'form_whatsapp_site',
      project: project,
      tipo_evento: a.tipo_evento?.value || '',
      event_id: tracking['event_id'] || window.__page_event_id || '',
    });
  }

  let convoStarted = false;
  async function runConversation() {
    if (convoStarted) return;
    convoStarted = true;

    // Replay instantâneo do que já aconteceu nesta sessão (recarregou a página)
    introMessages.forEach((m) => bubble('agent', m, true));
    fields.slice(0, state.idx).forEach((f) => {
      bubble('agent', f.label, true);
      const ans = state.answers[f.key];
      if (ans) bubble('user', ans.display, true);
    });

    if (state.done) {
      bubble('agent', 'Recebemos sua solicitação! ✅', true);
      ctaBubble();
      return;
    }

    if (state.idx === 0) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'form_start', form_source: 'whatsapp', project: project, form_id: 'form_whatsapp_site', form_name: 'form_whatsapp_site' });
      // repete a intro "ao vivo": remove o replay e digita de verdade
      chat.innerHTML = '';
      for (const m of introMessages) await agentSays(m);
    }

    while (state.idx < fields.length) {
      const field = fields[state.idx];
      await agentSays(field.label, 600);
      showInput(field);
      const answer = await new Promise((resolve) => { activeResolve = resolve; });
      bubble('user', answer.display);
      state.answers[field.key] = answer;
      state.idx += 1;
      saveState();
      if (field.key === 'nome' && answer.display) {
        await wait(350);
        setTyping(true); await wait(500); setTyping(false);
        bubble('agent', `Prazer, ${answer.display.split(/\s+/)[0]}! 😊`);
      }
      await wait(350);
    }

    // Encerramento
    setTyping(true);
    await Promise.all([submitLead(), wait(900)]);
    setTyping(false);
    state.done = true;
    saveState();
    bubble('agent', `Perfeito, ${state.answers.nome?.display.split(/\s+/)[0] || ''}! Já estou te chamando no WhatsApp 🚀`.replace(', !', '!'));
    ctaBubble();
    await wait(1200);
    window.location.href = waUrl();
  }

  /* ── Mobile: trava o scroll da página atrás do chat ── */
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
  function lockScroll(on) {
    const lock = on && isMobile();
    document.documentElement.style.overflow = lock ? 'hidden' : '';
    try { lock ? window.__lenis?.stop() : window.__lenis?.start(); } catch (_) {}
  }

  /* ── Mobile (iOS): o teclado sobrepõe elementos fixos sem redimensionar o
     layout — acompanha o visualViewport para manter a barra de input visível ── */
  const vvp = window.visualViewport;
  function adjustForKeyboard() {
    if (!vvp || popup.hidden || !isMobile()) {
      popup.style.bottom = '';
      popup.style.height = '';
      return;
    }
    const kb = Math.max(0, window.innerHeight - vvp.height - vvp.offsetTop);
    if (kb > 60) {
      popup.style.bottom = `${kb + 10}px`;
      popup.style.height = `${Math.min(vvp.height - 76, 560)}px`;
    } else {
      popup.style.bottom = '';
      popup.style.height = '';
    }
    scrollChat();
  }
  if (vvp) {
    if (window.__waVVResize) {
      vvp.removeEventListener('resize', window.__waVVResize);
      vvp.removeEventListener('scroll', window.__waVVResize);
    }
    window.__waVVResize = adjustForKeyboard;
    vvp.addEventListener('resize', adjustForKeyboard);
    vvp.addEventListener('scroll', adjustForKeyboard);
  }

  /* ── Abrir / fechar ─────────────────────────── */
  function openPopup(origem) {
    // Conversão Contact: abrir o popup (não fechar) dispara whatsapp_click, sem PII, uma vez por abertura
    if (popup.hidden) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'whatsapp_click', click_type: 'abrir_popup', link_location: origem || 'flutuante', project: project });
    }
    hideTeaser(false);
    popup.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => popup.classList.add('wa-popup--open')));
    toggle.setAttribute('aria-expanded', 'true');
    badge.style.display = 'none';
    lockScroll(true);
    runConversation();
    if (activeField) setTimeout(() => currentInputEl().focus({ preventScroll: true }), 300);
    scrollChat();
  }

  function closePopup() {
    popup.classList.remove('wa-popup--open');
    toggle.setAttribute('aria-expanded', 'false');
    lockScroll(false);
    setTimeout(() => {
      popup.hidden = true;
      popup.style.bottom = '';
      popup.style.height = '';
    }, 280);
  }

  toggle.addEventListener('click', () => {
    popup.hidden ? openPopup('flutuante') : closePopup();
  });
  closeBtn.addEventListener('click', closePopup);

  /* ── Teaser ─────────────────────────────────── */
  function hideTeaser(persist) {
    if (!teaser || teaser.hidden) return;
    teaser.classList.remove('wa-teaser--in');
    setTimeout(() => { teaser.hidden = true; }, 220);
    if (persist) { try { sessionStorage.setItem('wa_teaser_off', '1'); } catch (_) {} }
  }
  if (teaser && !sessionStorage.getItem('wa_teaser_off') && state.idx === 0 && !state.done) {
    setTimeout(() => {
      if (popup.hidden) {
        teaser.hidden = false;
        requestAnimationFrame(() => teaser.classList.add('wa-teaser--in'));
      }
    }, 4500);
  }
  document.getElementById('wa-teaser-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideTeaser(true);
  });
  document.getElementById('wa-teaser-open')?.addEventListener('click', () => {
    try { sessionStorage.setItem('wa_teaser_off', '1'); } catch (_) {}
    openPopup('teaser');
  });

  // O calendário (flatpickr) é anexado ao <body>, FORA do popup. Enquanto ele
  // estiver aberto, nenhum clique/ESC deve fechar o popup. O estado vem do
  // próprio flatpickr (window.__waCalendarOpen, definido via onOpen/onClose no
  // outro <script>) — não depende do alvo do clique, então é à prova de
  // re-render do calendário.
  const isCalendarEngaged = () => window.__waCalendarOpen === true;

  // Listeners de document idempotentes: removemos o anterior antes de registrar.
  // Isso evita que o HMR (dev) empilhe múltiplos handlers antigos que fechavam
  // o popup mesmo com a correção aplicada.
  if (window.__waOutsideClick) document.removeEventListener('click', window.__waOutsideClick);
  window.__waOutsideClick = (e) => {
    if (isCalendarEngaged()) return;
    if (
      !popup.hidden &&
      !popup.contains(e.target) &&
      e.target !== toggle &&
      !toggle.contains(e.target)
    ) {
      closePopup();
    }
  };
  document.addEventListener('click', window.__waOutsideClick);

  if (window.__waEscKey) document.removeEventListener('keydown', window.__waEscKey);
  window.__waEscKey = (e) => {
    if (e.key === 'Escape' && !popup.hidden && !isCalendarEngaged()) closePopup();
  };
  document.addEventListener('keydown', window.__waEscKey);

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
