import { i18n } from '../i18n/i18n.js';

/**
 * Formata uma data para o formato curto: dd/mm/yyyy
 */
export function formatDate(date) {
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(i18n.currentLanguage);
}

/**
 * Formata uma data e hora: dd/mm/yyyy HH:mm
 */
export function formatDateTime(date) {
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleString(i18n.currentLanguage, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formata uma data em formato extenso: 16 de abril de 2025
 */
export function formatFullDate(date) {
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(i18n.currentLanguage, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formata uma data e hora em formato extenso: 16 de abril de 2025 às 14:30
 */
export function formatFullDateTime(date) {
  const d = new Date(date);
  if (isNaN(d)) return '';
  const dateStr = d.toLocaleDateString(i18n.currentLanguage, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = d.toLocaleTimeString(i18n.currentLanguage, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateStr} às ${timeStr}`;
}
