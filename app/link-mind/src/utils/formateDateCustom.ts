export function formatDateCustom(isoString: string): string {
    const date = new Date(isoString); // Cria o objeto Date (aqui ele já converte para a hora local internamente)

    // Altere getUTC... para get... para usar o fuso horário local do dispositivo do usuário
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0'); // <-- HORAS LOCAIS
    const minutes = String(date.getMinutes()).padStart(2, '0'); // <-- MINUTOS LOCAIS

    return `${day}/${month}/${year} às ${hours}:${minutes}`; 
}