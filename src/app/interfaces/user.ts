import { Event } from "./event";
import { Notification } from "./notification";

export interface User {
    id:       number;
    name:     string;
    email:    string;
    password: string;
    role:     string;
    events:   Event[];
    notifications:   Notification[];
}
