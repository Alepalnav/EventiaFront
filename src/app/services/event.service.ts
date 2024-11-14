import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Event } from '../interfaces/event';
import { Participation } from '../interfaces/participation';
import { User } from '../interfaces/user';
import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private url: string = 'http://localhost:8080'

  constructor(private http: HttpClient) {
    console.log('Servicio iniciado')
  }

  getEvent(id:number): Observable<Event> {
    return this.http.get<Event>(`${this.url}/event/${id}`);
  }

  listEvents(numPage: number, pageSize: number, order: string, ad: boolean): Observable<Event[]> {
    // Configura los parámetros para la petición GET
    const params = new HttpParams()
      .set('numPage', numPage.toString())
      .set('pageSize', pageSize.toString())
      .set('order', order)
      .set('ad', ad ? 'asc' : 'desc');

    return this.http.get<any>(`${this.url}/events`, { params })
      .pipe(
        map(response => response.content.map((event: any) => ({
          id: event.id,
          user: event.user,
          title: event.title,
          descrip: event.descrip,
          date_start: event.date_start,
          date_finish: event.date_finish,
          hour_start: event.hour_start,
          hour_finsh: event.hour_finsh,
          place: event.place,
          category: event.category,
          max_participant: event.max_participant,
          participants: event.participants,
          available: event.available,
        }))),
        catchError(err => {
          console.error('Error al cargar los productos:', err);
          return throwError(err);
        })
      );
  }

  addEvent(event: Event):Observable<Object>{
    console.log(event);
    return this.http.post<Object>(`${this.url}/events`,event)
  }
  editEvent(id:number,event: Event):Observable<Object>{
    console.log(event);
    return this.http.put<Object>(`${this.url}/events/${id}`,event)
  }

  participateEvent(participation: Participation):Observable<Object>{
    console.log(participation);
    return this.http.post<Object>(`${this.url}/participate`,participation)
  }

  eventsByUser(user: number):Observable<Event[]>{
    return this.http.get<Event[]>(`${this.url}/eventsByUser/${user}`)
  }

  eventsByOrg(user: number):Observable<Event[]>{
    return this.http.get<Event[]>(`${this.url}/eventsByOrg/${user}`)
  }

  cancelParticipation(idUser:number, idEvent:number):Observable<Object>{
    const params = new HttpParams()
      .set('idUser', idUser)
      .set('idEvent', idEvent)
    return this.http.delete<Object>(`${this.url}/participation`,{params})
  }

  getParticipants(event: number):Observable<User[]>{
    return this.http.get<User[]>(`${this.url}/participants/${event}`)
  }

  addNotification(notification: Notification):Observable<Object>{
    return this.http.post<Object>(`${this.url}/notifications`,notification);
  }
  
}
