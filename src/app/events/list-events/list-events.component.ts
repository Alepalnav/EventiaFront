import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../interfaces/event';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Participation } from '../../interfaces/participation';
import Swal from 'sweetalert2';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-list-events',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule],
  templateUrl: './list-events.component.html',
  styleUrl: './list-events.component.css'
})
export class ListEventsComponent implements  OnInit{


  events: Event[]=[];
  numPage = 1; // Página por defecto
  order = 'id'; // Orden por defecto
  pageSize = 12;
  ad = false;
  user!:User;
  id:number=0;
  participation!:Participation;

  error=false;

  isLogged=false;

  currentFilterName: string | null = null;

  constructor(
    private servicio: EventService,
    // private cartServicio: CartService,
    private userService: UserService,
    private router: Router

  ){}

  ngOnInit(): void {
    this.numPage=1;
    this.id=this.userService.getCurrentUser().id;
    this.loadEvents();
  }


loadEvents(): void {
      
        this.servicio.listEvents(this.numPage, this.pageSize, this.order, this.ad)
        .subscribe(
          response => {
            this.events = response;
          }
          );
        }

  nextPage(): void {
    this.numPage++;
    this.loadEvents();
  }

  prevPage(): void {
    if (this.numPage > 1) {
      this.numPage--;
      this.loadEvents();
    }
  }
  
  orderBy(order: string): void {
    if (this.order === order) {
      this.ad = !this.ad;
    } else {
      this.order = order;
      this.ad = true;
    }
    this.loadEvents();
  }


  participate(idEvent:number){
    this.participation={
      user: this.id,
      event: idEvent,
    }
    this.servicio.participateEvent(this.participation).subscribe({
      next:(res)=>{
        Swal.fire({
          title: "Good job!",
          text: "You joined the event!",
          icon: "success"
        });
      }
    });
    
  }

  details(id:number){
    this.servicio.getEvent(id).subscribe({
      next:(res)=>{
        Swal.fire({
          title: res.title,
          html: `<p><strong>Description:</strong> ${res.descrip}</p>
                <p><strong>Place:</strong> ${res.place}</p>
                <p><strong>Date:</strong> ${res.date_start}  ${res.hour_start}</p>`,
          icon: "info",
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'View Details',
        }).then((result)=>{
          if(result.isConfirmed){
            this.router.navigate(['/events/details',id]);
          }else {

          }
        });
      }
    })
  }

  compararFecha(date: Date): boolean{
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaEvent = new Date(date);
    fechaEvent.setHours(0, 0, 0, 0);


    return hoy.getTime() < fechaEvent.getTime();
  }

  today = new Date();



}


