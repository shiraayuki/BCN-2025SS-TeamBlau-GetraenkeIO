import { publicAxios } from "../../api/axiosInstance";
import type { Drink } from '../../models/drinksModels';
import type { UserData } from "../../models/userModels";

export const drinksmgmtService = {
    async getDrinks(userData: UserData): Promise<Drink[]> {
        const res = await publicAxios.get('/drinks/', {
            auth: {
                username: userData.credentials.username,
                password: userData.credentials.password
            }
        });

        return res.data.map((drink: any) => ({
            ...drink,
            cost: typeof drink.cost === 'string' ? parseFloat(drink.cost) : drink.cost,
        }));

    },

    async createDrink(drink: Omit<Drink, 'id'>, userData: UserData) {
        const res = await publicAxios.post('/drinks/', drink, {
            auth: {
                username: userData.credentials.username,
                password: userData.credentials.password
            }
        });

        return res.data
    },

    async updateDrink(id: number, drink: Omit<Drink, 'id'>, userData: UserData) {
        const res = await publicAxios.put(`/drinks/${id}`, drink, {
            auth: {
                username: userData.credentials.username,
                password: userData.credentials.password
            }
        });
        return res.data;
    },

    async deleteDrink(id: number, userData: UserData) {
        const res = await publicAxios.delete(`/drinks/${id}`, {
            auth: {
                username: userData.credentials.username,
                password: userData.credentials.password
            }
        });
        return res.data;
    }
};
