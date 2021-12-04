export function convertToRupiah(number) {

    if (number) {
  
      var rupiah = "";
  
      var numberrev = number
  
        .toString()
  
        .split("")
  
        .reverse()
  
        .join("");
  
      for (var i = 0; i < numberrev.length; i++)
  
        if (i % 3 == 0) rupiah += numberrev.substr(i, 3) + ".";
  
      return (
  
        "Rp. " +
  
        rupiah
  
          .split("", rupiah.length - 1)
  
          .reverse()
  
          .join("")
  
      );
  
    } else {
  
      return number;
  
    }
  
  }