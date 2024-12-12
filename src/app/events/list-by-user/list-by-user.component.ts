import { Component, OnInit } from '@angular/core';
import { Event } from '../../interfaces/event';
import { User } from '../../interfaces/user';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Rating } from '../../interfaces/rating';

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
  rating!:Rating;

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

  rateEvent(idEvent: number) {
    Swal.fire({
      title: 'Rate this event',
      html: `
        <div>
          <label for="ratingInput"><strong>Rating (1-5):</strong></label>
          <input id="ratingInput" type="number" min="1" max="5" class="swal2-input" placeholder="Enter a rating" style="width: 100px; margin-bottom: 15px;"/>
          <br>
          <label for="commentInput"><strong>Comment:</strong></label>
          <input id="commentInput" class="swal2-textarea" placeholder="Write your comment here..." style="height: 100px;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const ratingValue = Number((document.getElementById('ratingInput') as HTMLInputElement).value);
        const commentValue = (document.getElementById('commentInput') as HTMLTextAreaElement).value;
  
        if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
          Swal.showValidationMessage('Please enter a rating between 1 and 5');
        }
  
        if (!commentValue) {
          Swal.showValidationMessage('Please enter a comment');
        }
  
        return { rating: ratingValue, comment: commentValue };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { rating, comment } = result.value;
  
        this.rating = {
          user: this.id,
          event: idEvent,
          stars: rating,
          comment: comment,
        };
  
        this.servicio.valorateEvent(this.rating).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Thank you!',
              text: 'Your rating has been submitted.',
              icon: 'success',
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Oops...',
              text: 'There was a problem submitting your rating. Please try again.',
              icon: 'error',
            });
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log('Rating cancelled');
      }
    });
  }
  



}
