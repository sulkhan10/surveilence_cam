import axios from "axios";
import { webserviceurl } from "./baseUrl";

export function apiDokterList(filter) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/dokter_list.php",
      data: {
        filter: filter,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiDokterDelete(dokterId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/dokter_delete.php",
      data: {
        dokterId: dokterId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiDokterGetId(dokterId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/dokter_getId.php",
      data: {
        dokterId: dokterId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiDokterInsertUpdate(body) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/dokter_insert_update.php",
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiSpesialisList() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/spesialis_list.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiDeleteSpesialis(spesialisId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/spesialis_delete.php",
      data: {
        spesialisId: spesialisId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiSpesilaisInputUpdate(body) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/spesialis_insert_update.php",
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiGejalaList() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/gejala_list.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiDeleteGejala(gejalaId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/gejala_delete.php",
      data: {
        gejalaId: gejalaId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiGejalaInputUpdate(body) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/gejala_insert_update.php",
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiMenuIconList() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/icon_list.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiDeleteMenuIcon(menuId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/icon_delete.php",
      data: {
        menuId: menuId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiMenuIconInsertUpdate(body) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/icon_insert_update.php",
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiBannerList() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/banner_list.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiDeleteBanner(bannerId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/banner_delete.php",
      data: {
        bannerId: bannerId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiBannerInsertUpdate(body) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/banner_insert_update.php",
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiTambahanList() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/tambahan_list.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiDeleteTambahan(tambahanId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/tambahan_delete.php",
      data: {
        tambahanId: tambahanId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiTambahanInsertUpdate(body) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/tambahan_insert_update.php",
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiPaketUtamaList() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/utama_list.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiDeletePaketUtama(paketId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/utama_delete.php",
      data: {
        paketId: paketId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiPaketUtamaInsertUpdate(body) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/utama_insert_update.php",
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
