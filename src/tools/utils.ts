import { APP_STATUS } from "../enums/app_env";
import clients from '../clients.json'

type AppEnv = {
        APP_KEY: string
        APP_ENV: APP_STATUS
}

export function getEnv(): AppEnv {
        return process.env as AppEnv;
}

export function getCorsOrigin(): string[] {
        const URI = getEnv().APP_ENV == APP_STATUS.DEV ? clients.offline.URI : clients.online.URI
        return URI;
}