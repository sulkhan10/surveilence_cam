import { toIP } from "@network-utils/arp-lookup";

export async function getIpAddresFromMacAddres() {
  try {
    const MAC = "48:98:CA:A9:C0:8A";
    const response = await toIP(MAC);
    return response;
  } catch (error) {
    throw error;
  }
}
