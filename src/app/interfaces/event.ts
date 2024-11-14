import { Time } from "@angular/common";
import { User } from "./user";
import { Participation } from "./participation";
import { Notification } from "./notification";
import { Rating } from "./rating";

export interface Event {
    id:       number;
    user:     User;
    title:    string;
    descrip: string;
    date_start:     Date;
    date_finish:     Date;
    hour_start:     Time;
    hour_finsh:     Time;
    place: string;
    category: string;
    max_participant: number;
    participants: number;
    available: number;
    participations:   Participation[];
    ratings:   Rating[];
    notifications:   Notification[];
}
