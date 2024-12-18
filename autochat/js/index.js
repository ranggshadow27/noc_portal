let jsonData;

// Fungsi untuk membaca file JSON yang diunggah
document.getElementById("file").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    jsonData = JSON.parse(e.target.result); // Simpan isi file JSON ke variabel
    alert("JSON File Fetched Successfully!");
  };

  reader.readAsText(file); // Baca file sebagai teks
});

function downloadJSON(jsonData, filename) {
  const blob = new Blob([jsonData], { type: "application/json" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function autoResizeTextarea() {
  const chatTextarea = document.getElementById("OutputFormatChat");
  chatTextarea.style.height = "auto"; // Reset height
  chatTextarea.style.height = chatTextarea.scrollHeight + "px"; // Set to scroll height

  const infoTextarea = document.getElementById("AdditionalInfo");
  infoTextarea.style.height = "auto"; // Reset height
  infoTextarea.style.height = infoTextarea.scrollHeight + "px"; // Set to scroll height
}

function searchSiteName() {
  const terminalID = document.getElementById("terminal_id").value;
  let siteName = {};

  console.log(`Input Terminal ID nya : ${terminalID}`);
  console.log(`Ini jumlah datanya ${jsonData.length}`);

  for (let index = 0; index < jsonData.length; index++) {
    // console.log(jsonData[index]["__EMPTY"]);
    if (jsonData[index]["site_id"] === terminalID) {
      siteName = {
        site_id: jsonData[index]["site_id"],
        site_name: jsonData[index]["site_name"],
        pic_name: jsonData[index]["pic_name"],
        address: jsonData[index]["address"],
        province: jsonData[index]["province"],
        administrative_area: jsonData[index]["administrative_area"],
        latitude: jsonData[index]["latitude"],
        longitude: jsonData[index]["longitude"],
        no_pic: jsonData[index]["no_pic"],
        pic_name: jsonData[index]["pic_name"],
        no_penyedia: jsonData[index]["no_penyedia"],
        penyedia_name: jsonData[index]["penyedia_name"],
        spotbeam: jsonData[index]["spotbeam"],
        ip_hub: jsonData[index]["ip_hub"],
        gateway: jsonData[index]["gateway"],
        power_source: jsonData[index]["power_source"],
        batch: jsonData[index]["batch"],
      };
    }
  }

  document.getElementById(
    "nama_site"
  ).value = `${siteName["site_name"]} - ${siteName["province"]}`;

  return siteName;
}

function generateChat() {
  // Get input values
  const namaSite = searchSiteName();
  const picGender = document.getElementById("pic_gender").value;
  const type = document.getElementById("type").value;

  let splitNamaSite = document.getElementById("nama_site").value.split(" - ");
  let provinsiSopan = splitNamaSite[1]
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  let namaPICSopan = namaSite["pic_name"];

  let namaSiteSopan = `${splitNamaSite[0]} - ${provinsiSopan}`;

  // Determine greeting based on current time
  const hours = new Date().getHours();

  let greeting;
  if (hours >= 4 && hours < 11) {
    greeting = "Pagi";
  } else if (hours >= 11 && hours < 15) {
    greeting = "Siang";
  } else if (hours >= 15 && hours < 19) {
    greeting = "Sore";
  } else {
    greeting = "Malam";
  }

  // Generate the chat format
  const initialChat = `Selamat ${greeting} ${picGender}\n
Kami dari tim NOC Mahaga, penyedia perangkat WiFi Bakti di lokasi ${namaSiteSopan}. 📡\n 
Berdasarkan pemantauan kami, layanan WiFi Bakti di lokasi ${picGender} saat ini mengalami gangguan dan internet tidak dapat digunakan selama 5 hari terakhir, Mohon izin, apakah di lokasi sedang terkendala masalah kelistrikan atau mungkin terdapat kendala pada perangkat kami ya ${picGender}?\n
Mohon dibantu konfirmasinya ${picGender}, Kami siap membantu agar layanan internet WiFi dapat segera kembali digunakan dengan baik.\n
Terima kasih banyak sebelumnya ${picGender}. 🙏`;

  const pushChat = `Selamat ${greeting} ${picGender}\n
Mohon maaf mengganggu waktunya ${picGender} 🙏\n
Kami dari tim NOC Mahaga ingin menyampaikan terkait layanan WiFi Bakti di lokasi ${picGender} yang saat ini masih terpantau mengalami gangguan, Mohon kiranya ${picGender} dapat membantu kami dengan melakukan pengecekan awal pada perangkat di lokasi. 🙏 \n
Apabila pengecekan tersebut tidak memungkinkan, mohon bantuannya ya ${picGender} untuk menginformasikan kontak alternatif yang dapat kami hubungi agar pengecekan perangkat dapat segera dilakukan. \n
Jika diperlukan penanganan teknis lebih lanjut, kami siap mengirimkan teknisi ke lokasi ${picGender} dan melakukan penggantian perangkat jika dibutuhkan. Namun, untuk langkah awal, kami sangat menghargai bantuan ${picGender} dalam pengecekan ini. \n
Terima kasih banyak atas bantuan dan kerja samanya ${picGender}. 🙏`;

  const pushChat_v2 = `Selamat ${greeting} ${picGender},

Mohon maaf mengganggu waktunya, Mohon izin ${picGender} untuk menyampaikan bahwa internet Bakti dilokasi ${picGender} masih termonitor gangguan sampai saat ini, Mohon kiranya ${picGender} dapat membantu dengan menginformasikan kami terkait masalah dilokasi, 

Jika memang tidak memungkinkan apakah ada kontak rekan lain yang dilokasi dan dapat kami hubungi ${picGender}?

Kami siap membantu agar layanan internet WiFi Bakti ${picGender} dapat kembali digunakan dengan baik 🙏`;

  const requestVideo = `Mohon izin ${picGender}, apakah kami boleh minta bantuan ${picGender} untuk videokan perangkat kami didalam box hitam dalam kondisi menyala, lalu mengirimkannya ke WhatsApp kami? 🙏 Dikarenakan video tersebut akan sangat membantu kami untuk segera melakukan pengecekan awal terkait gangguan yang terjadi.
  
Jika diperlukan penanganan teknis lebih lanjut, kami siap mengirimkan teknisi ke lokasi ${picGender} dan melakukan penggantian perangkat jika dibutuhkan. Namun untuk langkah awal, kami sangat menghargai bantuan ${picGender} dalam pengecekan ini.🙏`;

  const suratLibur = `Selamat ${greeting} ${picGender},

Mohon maaf mengganggu waktunya. Terkait libur panjang yang akan datang, kami ingin menginformasikan bahwa perangkat WiFi Bakti di lokasi ${namaSiteSopan} dapat dimatikan sementara jika tidak digunakan selama libur panjang.

Sehubungan dengan hal ini, kami mohon izin bantuan ${picGender} untuk dibuatkan surat resmi dari instansi ${picGender} yang menggunakan kop surat dan cap basah jika memang ada rencana mematikan perangkat WiFi hingga libur panjang selesai 🙏

Surat ini akan kami gunakan sebagai laporan kepada pihak Bakti Kominfo untuk memastikan bahwa perangkat WiFi di lokasi ${picGender} tidak mengalami kendala teknis, melainkan dimatikan sementara karena libur panjang.

Kami sangat menghargai bantuan dan kerjasama ${picGender} perihal ini. Terima kasih banyak sebelumnya. 🙏`;
  // Display the generated chat in the output textarea
  const outputArea = document.getElementById("OutputFormatChat");
  const contactOutputArea = document.getElementById("OutputContact");
  const additionalInfo = document.getElementById("AdditionalInfo");

  outputArea.value = initialChat;

  if (type == "Push V1") {
    outputArea.value = pushChat;
  } else if (type == "Push V2") {
    outputArea.value = pushChat_v2;
  } else if (type == "Request Video") {
    outputArea.value = requestVideo;
  } else if (type == "Surat Libur") {
    outputArea.value = suratLibur;
  }

  additionalInfo.value = `• Lokasi		: 
${namaSite["site_id"]} - ${namaSite["site_name"]}

• Data PIC	:
PIC Lokasi	${namaSite["pic_name"]} / ${namaSite["no_pic"]}
Penyedia	${namaSite["penyedia_name"]} / ${namaSite["no_penyedia"]}

• Provinsi	:
${namaSite["administrative_area"]}, ${namaSite["province"]} 

• Alamat		:
${namaSite["address"]}

• Koordinat	:
Latitude ${namaSite["latitude"]} / Longitude ${namaSite["longitude"]}

• Spotbeam	: ${namaSite["spotbeam"]} / ${namaSite["ip_hub"]}
• Gateway	: ${namaSite["gateway"]}
• Power		: ${namaSite["power_source"]}
• Batch		: ${namaSite["batch"]}`;

  contactOutputArea.value = `${namaSite["no_pic"] == "-" ? "" : ``}${
    namaPICSopan == "-" ? "" : `${namaPICSopan} `
  }PIC ${namaSite["site_name"]} - ${namaSite["province"]}`;

  autoResizeTextarea();

  // Copy to clipboard
  outputArea.select();
  document.execCommand("copy");
  // alert("Chat format copied to clipboard!");
}

function copyContactName() {
  const contactOutputArea = document.getElementById("OutputContact");

  contactOutputArea.select();
  document.execCommand("copy");

  if (contactOutputArea.value == null || contactOutputArea.value == "") {
    return alert("Terminal ID is Empty!");
  }

  alert("PIC Contact Name copied to clipboard!");
}

document
  .getElementById("OutputFormatChat")
  .addEventListener("input", autoResizeTextarea);
