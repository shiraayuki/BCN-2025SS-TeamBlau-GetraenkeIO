import { createPrivateAxios, publicAxios } from '../../api/axiosInstance';
import type { UserData, UserLoginData, UserRegisterData } from '../../models/userModels';

export const authSerive = {
  async login(userLoginData: UserLoginData): Promise<UserData> {
    const res = await publicAxios.get('/users/me', {
      auth: {
        username: userLoginData.username,
        password: userLoginData.password,
      },
    });

    return {
      username: res.data.name,
      isAdmin: res.data.is_admin,
      credentials: {
        username: userLoginData.username,
        password: userLoginData.password,
      },
    };
  },

  async register(userRegisterData: UserRegisterData) {
    const res = await publicAxios.post('/users/', {
      name: userRegisterData.username,
      password: userRegisterData.password,
    });

    return res;
  },

  async logout() {
    // Logout logic
  },
};
