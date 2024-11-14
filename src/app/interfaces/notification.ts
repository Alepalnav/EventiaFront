import { Event } from "./event";
import { User } from "./user";

export interface Notification {
    // id:       number;
    user:     number;
    event:    number;
    message: string;
}
