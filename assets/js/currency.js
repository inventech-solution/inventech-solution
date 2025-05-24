(function () {
    const currencyMap = {
        "AED": "د.إ",
        "ARS": "ARS$",
        "AUD": "A$",
        "BDT": "৳",
        "BGN": "лв",
        "BHD": "ب.د",
        "BND": "B$",
        "BOB": "Bs.",
        "BRL": "R$",
        "BWP": "P",
        "CAD": "C$",
        "CHF": "CHF",
        "CLP": "CLP$",
        "CNY": "¥",
        "COP": "COL$",
        "CRC": "₡",
        "CZK": "Kč",
        "DKK": "kr",
        "DOP": "RD$",
        "DZD": "د.ج",
        "EGP": "E£",
        "ETB": "Br",
        "EUR": "€",
        "GBP": "£",
        "GTQ": "Q",
        "HKD": "HK$",
        "HNL": "L",
        "HRK": "kn",
        "HUF": "Ft",
        "IDR": "Rp",
        "ILS": "₪",
        "INR": "₹",
        "ISK": "kr",
        "JMD": "J$",
        "JOD": "JD",
        "JPY": "¥",
        "KES": "KSh",
        "KRW": "₩",
        "KWD": "KD",
        "KZT": "₸",
        "LBP": "ل.ل",
        "LKR": "Rs",
        "MAD": "د.م.",
        "MDL": "L",
        "MMK": "K",
        "MOP": "MOP$",
        "MXN": "MX$",
        "MYR": "RM",
        "NGN": "₦",
        "NOK": "kr",
        "NZD": "NZ$",
        "PEN": "S/",
        "PHP": "₱",
        "PKR": "₨",
        "PLN": "zł",
        "PYG": "₲",
        "QAR": "QR",
        "RON": "lei",
        "RSD": "дин",
        "RUB": "₽",
        "SAR": "ر.س",
        "SEK": "kr",
        "SGD": "S$",
        "THB": "฿",
        "TND": "د.ت",
        "TRY": "₺",
        "TWD": "NT$",
        "TZS": "TSh",
        "UAH": "₴",
        "UGX": "USh",
        "USD": "$",
        "UYU": "$U",
        "VND": "₫",
        "ZAR": "R"
      };
  
      function getSymbol(code) {
        return currencyMap[code] || code;
      }
    
      $.get('../backend/controllers/facebookAPI.php', function (response) {
        if (response.currency) {
          window.currencyCode = response.currency;
          window.currencySymbol = getSymbol(response.currency);
        } else {
          console.warn('Currency not found in response');
        }
      }).fail(function () {
        console.error('Failed to fetch currency data from API');
      });
})();
  