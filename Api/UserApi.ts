import { AxiosInstance } from "axios";
import { Permission } from "./Models/Permission";

export type UserInfo<T extends Object = {}> = {
    id: number;
    uid: string;
    name: string;
    preferred_first_name: string;
    allPermissions: Permission[];
} & T;

export async function getUserInfo(api: AxiosInstance): Promise<UserInfo | null> {
    try {
        const user = await api.get('/api/v1/user');
        console.log(user);
        //TODO: Incorporate Sentry
        return user.data.user;
    } catch (error) {
        //TODO: incorporate logging
    }
    return null;
}