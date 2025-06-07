import { publicAxios } from "../../api/axiosInstance";
import type { UserData } from "../../models/userModels";

export const usermgmtService = {
  async getAllUserData(userData: UserData): Promise<UserData> {
    const res = await publicAxios.get('/users/', {
      auth: {
        username: userData.credentials.username,
        password: userData.credentials.password,
      }
    });

    return res.data;
  },

  async updateUserRecharge(userId: number, amout: number, userData: UserData) {
    await publicAxios.put(`/${userId}/rechagres`, amout, {
      auth: {
        username: userData.credentials.username,
        password: userData.credentials.password,
      }
    });
  }
}
