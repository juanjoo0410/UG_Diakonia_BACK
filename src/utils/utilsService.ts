export function limpiarTildes(texto: string = ''): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function capitalizarPrimeraLetra(texto: string = ''): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

export function normalizarFecha(fechaRaw: string | number): Date {
  if (!fechaRaw) return new Date();

  if (typeof fechaRaw === 'number') {
    return excelDateToJSDate(fechaRaw);
  }

  const cleanFecha = fechaRaw.trim();

  const matchDMY = cleanFecha.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (matchDMY) {
    const [_, dd, mm, yyyy] = matchDMY;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  }

  const matchYMD = cleanFecha.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
  if (matchYMD) {
    const [_, yyyy, mm, dd] = matchYMD;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  }

  return new Date();
}

export function excelDateToJSDate(serial: number): Date {
  // Excel considera 1900 como año bisiesto, hay que restar 1 día
  const excelEpoch = new Date(1900, 0, 1);
  const days = Math.floor(serial) - 1;
  const ms = days * 24 * 60 * 60 * 1000;
  return new Date(excelEpoch.getTime() + ms);
}