// Tarih formatını düzenleyen yardımcı fonksiyon
export const formatDate = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  // Geçerli bir tarih değilse orijinal string'i döndür
  if (isNaN(date.getTime())) return dateString;
  
  // Gün, ay ve yıl bilgilerini al
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  // Türkçe tarih formatı: GG.AA.YYYY
  return `${day}.${month}.${year}`;
};