import axios from "axios";
import { webserviceurl } from "./baseUrl";

export function apiCameraAddUpdate(body) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/cameraAddUpdate.php",
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

export function apiCameraList() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/cameraList.php",
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

export function apiCameraDelete(deviceId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/cameraDelete.php",
      data: { deviceId: deviceId },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiCameraId(deviceId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/cameraId.php",
      data: { deviceId: deviceId },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiCameraSelect() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/cameraSelect.php",
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
