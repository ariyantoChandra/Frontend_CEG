import { createAxiosInstance } from "./axiosInstances";
import { createHandleRequest } from "./interceptors";

// Membuat Axios instance dengan konfigurasi global
const handleRequest = createHandleRequest();
const axiosInstance = createAxiosInstance();

export const auth = {
  login: (data) => handleRequest(axiosInstance.post("api/auth/login", data)),

  // FUNGSI REGISTER BARU
  register: (data) =>
    handleRequest(axiosInstance.post("/api/auth/register", data)),
  registerAdmin: (data) =>
    handleRequest(axiosInstance.post("/api/auth/register-admin", data)),
};

export const penpos = {
  getPos: () => handleRequest(axiosInstance.get("/api/penpos/get-pos")),

  setUpdatedTeam: (currentPost) =>
    handleRequest(
      axiosInstance.get("/api/penpos/get-list-team", { params: currentPost })
    ),

  startBattle: (data) =>
    handleRequest(axiosInstance.post("/api/penpos/create-game-session", data)),

  resultMatch: (data) =>
    handleRequest(axiosInstance.post("/api/penpos/match-result", data)),
};

export const pos = {
  getListPos: () => handleRequest(axiosInstance.get("/api/user/get-list-pos")),
};

export const rally = {
  checkAcc: () => handleRequest(axiosInstance.get("/api/user/check-acc")),

  getUpdatedCurrentPost: (data) =>
    handleRequest(axiosInstance.put("/api/user/update-user-pos", data)),

  getWaitingList: (currentPost) =>
    handleRequest(
      axiosInstance.get("/api/penpos/get-list-team", { params: currentPost })
    ),

  quitGame: () =>
    handleRequest(axiosInstance.get("/api/user/exit-waiting-room")),
};

export const battleAbn = {
  getCard: (data) =>
    handleRequest(axiosInstance.post("/api/user/abn/get-card", data)),

  getReadyCard: (data) =>
    handleRequest(axiosInstance.post("/api/user/abn/get-ready-card", data)),

  checkReadyCard: (data) =>
    handleRequest(axiosInstance.post("/api/user/abn/check-ready-card", data)),

  resultSelectedCard: (data) =>
    handleRequest(axiosInstance.post("/api/user/abn/get-selected-card", data)),
};

export const admin = {
  // Ambil semua tim
  getAllTeams: () =>
    handleRequest(axiosInstance.get("/api/admin/get-all-teams")),

  // Ambil detail tim
  getTeamDetail: (teamId) =>
    handleRequest(axiosInstance.get(`/api/admin/get-team-detail/${teamId}`)),
  // === PERBAIKAN DI SINI: GUNAKAN FORMDATA ===
  verifyTeam: (teamId, status) => {
    // 1. Buat FormData
    const formData = new FormData();
    formData.append("status", status);

    // 2. Kirim FormData (Header akan otomatis diatur oleh Axios)
    return handleRequest(
      axiosInstance.put(`/api/admin/verify-payment/${teamId}`, formData)
    );
  },
};

export const sortTheProcess = {
  getItemsQuestion: (data) =>
    handleRequest(axiosInstance.post("/api/user/sort/get-sort-items", data)),

  postResult: (data) =>
    handleRequest(axiosInstance.post("/api/user/sort/get-sort-answer", data)),
};
