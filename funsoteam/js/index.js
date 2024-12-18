const options = {
  Modem: ["Modem Hang", "Modem Gagal Transmit"],
  Router: ["Router Fail", "Router Salah Config"],
  Access_Point_1: ["POE Fail", "AP 1 Fail"],
  Access_Point_2: ["POE Fail", "AP 2 Fail"],
};

const primarySelect = document.getElementById("problem_type");
const secondarySelect = document.getElementById("problem_detail");

primarySelect.addEventListener("change", function () {
  // Hapus semua opsi dari select 'secondary'
  secondarySelect.innerHTML = "<option value='-'>-- Pilih --</option>";

  // Dapatkan nilai terpilih dari select 'primary'
  const selectedPrimary = primarySelect.value;

  // Periksa apakah ada data opsi untuk nilai yang dipilih
  if (selectedPrimary && options[selectedPrimary]) {
    // Tambahkan opsi ke select 'secondary'
    options[selectedPrimary].forEach(function (item) {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      secondarySelect.appendChild(option);
    });
  }
});

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

function autoResizeTextarea() {
  const textarea = document.getElementById("OutputFormatChat");
  textarea.style.height = "auto"; // Reset height
  textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
}

function searchSiteName() {
  const terminalID = document.getElementById("terminal_id").value;
  let siteData = {};

  console.log(`Input Terminal ID nya : ${terminalID}`);
  console.log(`Ini jumlah datanya ${jsonData.length}`);

  for (let index = 0; index < jsonData.length; index++) {
    // console.log(jsonData[index]["__EMPTY"]);
    if (jsonData[index]["site_id"] === terminalID) {
      siteData = {
        site_id: jsonData[index]["site_id"],
        site_name: jsonData[index]["site_name"],
        province: jsonData[index]["province"],
        address: jsonData[index]["address"],
        longitude: jsonData[index]["longitude"],
        latitude: jsonData[index]["latitude"],
        no_pic: jsonData[index]["no_pic"],
        pic_name: jsonData[index]["pic_name"],
        po: jsonData[index]["po"],
        head_po: jsonData[index]["head_po"],
      };
    }
  }

  document.getElementById(
    "nama_site"
  ).value = `${siteData["site_name"]} - ${siteData["province"]}`;

  return siteData;
}

function formatText(text) {
  let newText = text
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return newText;
}

function generateChat() {
  // Get input values
  const siteData = searchSiteName();
  const primarySelect = document.getElementById("problem_type");
  const nocShift = document.getElementById("noc_shift");
  let selectedNOC = nocShift.options[nocShift.selectedIndex].text;
  const selectedProblem =
    primarySelect.options[primarySelect.selectedIndex].text;

  let result = checkResult();
  let address = formatText(siteData["address"]);
  let province = formatText(siteData["province"]);

  let regexProv = new RegExp(province, "i");

  if (!regexProv.test(address)) {
    address += `, ${province}`;
  }

  console.log(siteData);

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

  if (selectedNOC == "-- Pilih --") {
    selectedNOC = "-";
  }

  // Generate the chat format
  const headerText = `Selamat ${greeting},\n
Saat ini lokasi ${
    siteData["site_name"]
  } - ${province} mengalami kendala dengan status ${
    selectedProblem == "-- Pilih --" ? "" : selectedProblem
  } down, Hasil Pengecekan NOC : ${result}`;

  const footerText = `
Mohon bantuannya Pak @${siteData["po"]}, Dikarenakan site ini sudah masuk NMT,
- Site ID : ${siteData["site_id"]} - ${siteData["site_name"]}
- Alamat : ${address}  ${
    siteData["latitude"] == "-"
      ? ""
      : `\n- Koordinat : Long ${siteData["longitude"]}, Lat ${siteData["latitude"]}`
  }
- PIC : ${
    siteData["pic_name"] == "-"
      ? ""
      : `${siteData["no_pic"]} / ${siteData["pic_name"]}`
  }

Terima kasih, CC : Pak @${siteData["head_po"]}. 🙏
> NOC Shift : ${selectedNOC}`;

  // Display the generated chat in the output textarea
  const outputArea = document.getElementById("OutputFormatChat");
  outputArea.value = `${headerText}${footerText}`;

  autoResizeTextarea();

  // Copy to clipboard
  outputArea.select();
  document.execCommand("copy");
  // alert("Chat format copied to clipboard!");
}

function checkResult() {
  const primarySelect = document.getElementById("problem_detail").value;
  let result;

  if (primarySelect == options["Modem"][0]) {
    return (result = `
- Modem dilokasi Down (Mati total)
- Sudah dibantu PIC Plug UnPlug power dan pindah power source (NOK)
- Indikasi Modem Fail
`);
  } else if (primarySelect == options["Modem"][1]) {
    return (result = `
- Indikator Transmit, Receive dan System di Modem Down
- Reboot & Shutdown Modem Sementara oleh PIC (NOK)
- Optim Modem dari HUB (NOK)
- Indikasi Miss Pointing/Perlu Reinstall
`);
  } else if (primarySelect == options["Router"][0]) {
    return (result = `
- Indikator LAN di Modem tidak menyala (Statecode 13.1.1)
- Router termonitor Down (Mati total)
- Sudah dibantu PIC pindahkan Power Source Router (NOK)
- Indikasi Mikrotik dilokasi Fail
`);
  } else if (primarySelect == options["Router"][1]) {
    return (result = `
- Ping Modem Normal, Router Timeout
- Tidak ada Statecode 13.1.1 di Modem (Indikator LAN ke eth1 menyala Normal)
- Tukar kabel LAN dari eth1 >< eth2 ke arah modem (Router masih RTO)
- Reboot Router & Pastikan kabel LAN terpasang dengan baik (NOK)
- Indikasi kesalahan Konfigurasi pada Router/ter-Reset
`);
  } else if (primarySelect == options["Access_Point_1"][0]) {
    return (result = `
- Modem, Router Termonitor Normal
- LAN Access Point 1 Down (Interface Mikrotik Slave), indikator POE tidak menyala
- Plug UnPlug & Tukar Kabel Power POE (NOK)
- Indikasi POE Fail
`);
  } else if (primarySelect == options["Access_Point_1"][1]) {
    return (result = `
- Modem & Router Termonitor Normal
- Indikator Access Point 1 Down
- LAN Access Point 1 UP (Interface Mikrotik RS), indikator POE Normal
- Plug UnPlug POE & Pastikan kabel LAN dari POE >< AP terpasang dengan baik (NOK)
- Indikasi AP Fail/Kabel LAN dari POE ke arah AP Rusak
`);
  } else if (primarySelect == options["Access_Point_2"][0]) {
    return (result = `
- Modem & Router Termonitor Normal
- LAN Access Point 2 Down (Interface Mikrotik Slave), indikator POE tidak menyala
- Plug UnPlug & Tukar Kabel Power POE (NOK)
- Indikasi POE Fail
`);
  } else if (primarySelect == options["Access_Point_2"][1]) {
    return (result = `
- Modem & Router Termonitor Normal
- Indikator Access Point 2 Down
- LAN Access Point 2 UP (Interface Mikrotik RS), indikator POE Normal
- Plug UnPlug POE & Pastikan kabel LAN dari POE >< AP terpasang dengan baik (NOK)
- Indikasi AP Fail/Kabel LAN dari POE ke arah AP Rusak
`);
  } else {
    return (result = `
-
-
-
`);
  }
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
