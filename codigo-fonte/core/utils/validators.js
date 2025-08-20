import { i18n } from '../i18n/i18n.js';

export function validarEmail(email) {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email);
}

export function validarSenha(senha) {
  const requisitos = {
    minLength: senha.length >= 8,
    temMaiuscula: /[A-Z]/.test(senha),
    temMinuscula: /[a-z]/.test(senha),
    temNumero: /[0-9]/.test(senha),
    temCaractereEspecial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };

  const mensagens = [];
  if (!requisitos.minLength)
    mensagens.push(i18n.getTranslation('registration.password.requirements.minLength'));
  if (!requisitos.temMaiuscula)
    mensagens.push(i18n.getTranslation('registration.password.requirements.uppercase'));
  if (!requisitos.temMinuscula)
    mensagens.push(i18n.getTranslation('registration.password.requirements.lowercase'));
  if (!requisitos.temNumero)
    mensagens.push(i18n.getTranslation('registration.password.requirements.number'));
  if (!requisitos.temCaractereEspecial)
    mensagens.push(i18n.getTranslation('registration.password.requirements.special'));

  return {
    valida: Object.values(requisitos).every((req) => req),
    mensagens: [i18n.getTranslation('registration.password.requirements.title'), ...mensagens],
  };
}

export function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digitoVerificador1 = resto > 9 ? 0 : resto;

  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digitoVerificador2 = resto > 9 ? 0 : resto;

  return digitoVerificador2 === parseInt(cpf.charAt(10));
}

export function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, '');

  if (cnpj.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  // Validação do primeiro dígito verificador
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  // Validação do segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
}
