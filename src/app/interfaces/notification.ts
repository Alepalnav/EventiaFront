import { Event } from "./event";
import { User } from "./user";

export interface Notification {
    id:       number;
    user:     User;
    event:    Event;
    message: string;
}
