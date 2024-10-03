import { Event } from "./event";
import { User } from "./user";

export interface Rating {
    user:       User;
    event:     Event;
    stars:    number;
    comment: string;

}
