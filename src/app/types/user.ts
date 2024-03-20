import { Profile } from "./profile";

export type User = {
    id?: number
    email: string;
    nickname?: string;
    password: string;
    passwordC?: string;
    profileId?: number;
     }