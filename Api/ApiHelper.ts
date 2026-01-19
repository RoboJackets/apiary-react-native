import axios from "axios";
import { AppEnvironment } from "../AppEnvironment";
import { authTokenIsValid, getAuthToken, refreshAuth } from "../Auth/Authentication";

export async function apiGet(currentEnvironment: AppEnvironment, endpoint: string) {
    if (!await authTokenIsValid(currentEnvironment)) {
        const refresh = await refreshAuth(currentEnvironment);
        if (!refresh) return null;
    }
    const token = await getAuthToken(currentEnvironment);
    if (!token) return null;
    return await axios.get(endpoint, {
        baseURL: currentEnvironment.baseUrl,
        headers: {
            'Authorization': 'Bearer ' + token?.password,
        },
    });  
}