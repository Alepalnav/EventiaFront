import { Component, OnInit } from '@angular/core';
import { Event } from '../../interfaces/event';
import { User } from '../../interfaces/user';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-by-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-by-user.component.html',
  styleUrl: './list-by-user.component.css'
})
export class ListByUserComponent implements OnInit{

  events: Event[]=[];
  user!:User;
  id:number=0;

  today = new Date();

  constructor(
    private servicio: EventService,
    // private cartServicio: CartService,
    private userService: UserService,
    private router: Router

  ){}

  ngOnInit(): void {
      this.id=this.userService.getCurrentUser().id;
      this.servicio.eventsByUser(this.id).subscribe({
        next:(res)=>{
          this.events=res;
          console.log(this.events[0].date_start)
          console.log(this.today);
        }
      })
      
  }

  details(id:number){
    this.servicio.getEvent(id).subscribe({
      next:(res)=>{
        Swal.fire({
          title: res.title,
          html: `<p><strong>Description:</strong> ${res.descrip}</p>
                <p><strong>Place:</strong> ${res.place}</p>
                <p><strong>Date:</strong> ${res.date_start}  ${res.hour_start}</p>`,
          icon: "info"
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

  cancel(idEvent:number){
    this.servicio.cancelParticipation(this.id,idEvent).subscribe({
      next:(res)=>{
        this.servicio.eventsByUser(this.id).subscribe({
          next:(res)=>{
            this.events=res;
            console.log(this.events[0].date_start)
            console.log(this.today);
          }
        })
        Swal.fire({
          title: 'Good job!',
          text: 'You delete the participation!',
          icon: 'info'
        });
      }
    })

  }



}
