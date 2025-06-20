import { publicAxios } from "../../api/axiosInstance";
import { type Transaction } from "../../models/transactionModels";
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
  },

  async getUserTransactions(userName: string, userData: UserData): Promise<Transaction[]> {
    const res = await publicAxios.get<Transaction[]>(`/transactions/${userName}`, {
      auth: {
        username: userData.credentials.username,
        password: userData.credentials.password,
      }
    });

    const sorted = res.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return sorted
  }
}
