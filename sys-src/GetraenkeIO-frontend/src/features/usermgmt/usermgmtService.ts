import { publicAxios } from "../../api/axiosInstance";
import type { UserData, UserManagementData } from "../../models/userModels";

export const usermgmtService = {
  async getAllUserData(userData: UserData): Promise<UserManagementData[]> {
    const res = await publicAxios.get('/users/', {
      auth: {
        username: userData.credentials.username,
        password: userData.credentials.password,
      }
    });

    return res.data;
  },

  async updateUserRecharge(userId: string, amount: number, userData: UserData) {
    publicAxios.post(`/users/${userId}/recharges`, {
      amount: amount
    }, {
      auth: {
        username: userData.credentials.username,
        password: userData.credentials.password,
      }
    });
  }
}
