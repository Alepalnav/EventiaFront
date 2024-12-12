import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../interfaces/event';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Participation } from '../../interfaces/participation';
import Swal from 'sweetalert2';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  currentFilter: string = 'all';
  currentCategory: string = 'all';
  filteredEvents: Event[] = [];

  error=false;

  isLogged=false;

  currentFilterName: string | null = null;

  constructor(
    private servicio: EventService,
    // private cartServicio: CartService,
    private userService: UserService,
    private router: Router,

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
            this.applyFilter();
            this.applyCategoryFilter();
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


  participate(idEvent: number) {
    // Iniciar el loader y mostrar el SweetAlert de "Processing"

    Swal.fire({
      title: "Processing...",
      text: "Please wait while we check your participation status.",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false
    });
  
    // Comprobar si el usuario ya está participando
    this.servicio.isUserParticipating(this.id, idEvent).subscribe({
      next: (isParticipating) => {
        // Cerrar el alert inicial de "Processing"
        Swal.close();
  
        if (isParticipating) {
          // Si el usuario ya está participando, mostrar un mensaje informativo
          Swal.fire({
            title: "You're already participating!",
            text: "You have already joined this event.",
            icon: "info",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK"
          });

          return;
        }
  
        // Si no está participando, proceder a unirse
        this.participation = {
          user: this.id,
          event: idEvent,
        };
  
        // Mostrar el SweetAlert de "Joining"
        Swal.fire({
          title: "Joining...",
          text: "Please wait while we register you for the event.",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false
        });
  
        this.servicio.participateEvent(this.participation).subscribe({
          next: () => {
            Swal.close(); // Cerrar el alert de "Joining"
            Swal.fire({
              title: "Good job!",
              text: "You joined the event!",
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK"
            });
  
          },
          error: (err) => {
            Swal.close(); // Cerrar el alert de "Joining"
            console.error("Error joining the event:", err);
            Swal.fire({
              title: "Oops...",
              text: err.error?.message || "Something went wrong. Please try again.",
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "Retry"
            });

          }
        });
      },
      error: (err) => {
        Swal.close(); // Cerrar el alert de "Processing"
        console.error("Error checking participation:", err);
        Swal.fire({
          title: "Oops...",
          text: "Failed to check if you're already participating.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK"
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

  filterEvents(filter: string) {
    this.currentFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    const today = new Date();
    if (this.currentFilter === 'past') {
      this.filteredEvents = this.events.filter(event => new Date(event.date_finish) < today);
    } else if (this.currentFilter === 'future') {
      this.filteredEvents = this.events.filter(event => new Date(event.date_start) > today);
    } else {
      this.filteredEvents = [...this.events]; // Todos los eventos
    }
  }

  filterByCategory(category: string) {
    this.currentCategory = category;
    this.applyCategoryFilter();
  }

  applyCategoryFilter() {
    if (this.currentCategory === 'all') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event => event.category.toLowerCase() === this.currentCategory);
    }
  }

}


