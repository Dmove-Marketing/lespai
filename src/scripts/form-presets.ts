// ============================================================
// PADRÃO DE FORMULÁRIO DMOVE — fonte única dos campos
// ============================================================
// Catálogo de campos + presets por funil. Os `name` aqui são
// CANÔNICOS e batem com o keyMap do webhook (lead-payload.ts).
// Uma página só escolhe o preset (via config.json > forms.lead-form.preset);
// nunca redefine campo por campo → nome nunca chega torto no n8n.

import { tipoEventoOptions, tipoEventoCorporativoOptions } from './lead-payload';

export interface PresetFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface PresetField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  /** ocupa a linha inteira no grid de 2 colunas */
  full?: boolean;
  /** ativa o Flatpickr (calendário pt-BR) */
  datepicker?: boolean;
  /** texto de apoio no label, ex.: "não obrigatório" */
  hint?: string;
  options?: PresetFieldOption[];
}

// —— Campo "Tipo de evento": sempre TODAS as opções do WhatsApp ——
function makeTipoEvento(opts: { value: string; label: string }[]): PresetField {
  return {
    name: 'tipo_evento',
    type: 'select',
    label: 'Tipo de evento',
    required: true,
    options: [
      { value: '', label: 'Selecione o tipo de evento', disabled: true, selected: true },
      ...opts,
    ],
  };
}

// —— Campo "Nome da empresa": só no funil corporativo, sempre 1º ——
const empresa: PresetField = {
  name: 'empresa',
  type: 'text',
  label: 'Nome da empresa',
  placeholder: 'Nome da sua empresa',
  required: true,
  full: true,
};

// —— Empresa opcional: preset "geral" (aceita lead social ou corporativo) ——
const empresaOpcional: PresetField = {
  ...empresa,
  hint: 'não obrigatório',
  required: false,
};

// —— Campo "Detalhes do evento": ÚNICO opcional; fora do WhatsApp ——
const detalhes: PresetField = {
  name: 'detalhes_adicionais',
  type: 'textarea',
  label: 'Detalhes do evento',
  hint: 'não obrigatório',
  required: false,
  full: true,
};

// Núcleo comum (ordem pensada p/ o grid de 2 colunas fluir em pares:
// nome|telefone · email|tipo_evento · data|convidados)
const campos = (tipo: PresetField): PresetField[] => [
  { name: 'nome',      type: 'text',   label: 'Nome',                  placeholder: 'Seu nome completo',  required: true },
  { name: 'telefone',  type: 'tel',    label: 'Telefone',              placeholder: '(11) 00000-0000',    required: true },
  { name: 'email',     type: 'email',  label: 'E-mail',                placeholder: 'voce@empresa.com.br', required: true },
  tipo,
  { name: 'data_evento', type: 'text', label: 'Data do evento',        placeholder: 'dd/mm/aaaa', datepicker: true, required: true },
  { name: 'convidados', type: 'number', label: 'Número de convidados', placeholder: 'Ex: 150',            required: true },
  detalhes,
];

const nucleo = campos(makeTipoEvento(tipoEventoOptions));

// Geral: todos os tipos sociais + os da LP corporativa
const tiposGeral = [
  ...tipoEventoOptions.filter((o) => o.value !== 'Outros'),
  ...tipoEventoCorporativoOptions.filter((o) => o.value !== 'Outros' && !tipoEventoOptions.some((t) => t.value === o.value)),
  { value: 'Outros', label: 'Outros' },
].sort((a, b) => (a.value === 'Outros' ? 1 : b.value === 'Outros' ? -1 : a.label.localeCompare(b.label, 'pt-BR')));

export const formPresets: Record<'social' | 'corporativo' | 'geral', PresetField[]> = {
  social: nucleo,
  // Corporativo: empresa 1º + tipos de evento da LP corporativa
  corporativo: [empresa, ...campos(makeTipoEvento(tipoEventoCorporativoOptions))],
  // Geral: empresa opcional + todos os tipos (social e corporativo)
  geral: [empresaOpcional, ...campos(makeTipoEvento(tiposGeral))],
};

// Mapa de funil (slug) → preset. Corporativos ganham o campo "empresa".
export const funnelPreset: Record<string, keyof typeof formPresets> = {
  casamentos: 'social',
  debutantes: 'social',
  aniversarios: 'social',
  formaturas: 'social',
  'eventos-corporativos': 'corporativo',
  'eventos-corporativos-confraternizacoes': 'corporativo',
};

export function getPreset(name?: string): PresetField[] {
  const key = (name as keyof typeof formPresets) || 'social';
  return formPresets[key] || formPresets.social;
}
