import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/dark.css';
import { initForms } from './forms';

// Calendário pt-BR (minDate hoje, formato dd/mm/aaaa) nos campos marcados
document.querySelectorAll<HTMLInputElement>('input[data-datepicker]').forEach((el) => {
  flatpickr(el, {
    locale: Portuguese,
    dateFormat: 'd/m/Y',
    minDate: 'today',
    allowInput: true,
    disableMobile: true,
  });
});

initForms();
