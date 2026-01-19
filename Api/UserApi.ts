import { AppEnvironment } from "../AppEnvironment";
import { apiGet } from "./ApiHelper";

export async function getUserInfo(currentEnvironment: AppEnvironment) {
    return await apiGet(currentEnvironment, '/api/v1/user');
}