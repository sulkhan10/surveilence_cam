// var address = require("address");

const { toMAC, toIP } = require("@network-utils/arp-lookup");

async function getIpAddresFromMacAddres() {
  try {
    const MAC = "48:98:CA:A9:C0:8A";
    const response = await toIP(MAC);
    return response;
  } catch (error) {
    throw error;
  }
}

async function getMacAddresFromIpAddres() {
  try {
    const IP = "192.168.0.104";
    const response = await toMAC(IP);
    return response;
  } catch (error) {
    throw error;
  }
}

getIpAddresFromMacAddres()
  .then((res) => {
    console.log("IP Address: ", res);
  })
  .catch((err) => {
    console.log(err);
  });

getMacAddresFromIpAddres()
  .then((res) => {
    console.log("MAC Address: ", res);
  })
  .catch((err) => {
    console.log(err);
  });
