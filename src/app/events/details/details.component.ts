import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { ValidatorService } from '../../validators/validator.service';
import { CommonModule } from '@angular/common';
import { Rating } from '../../interfaces/rating';
import { Participation } from '../../interfaces/participation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [FormsModule,RouterOutlet,ReactiveFormsModule,CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{

  @Input('id') id: number = 0;
  eventForm!: FormGroup;
  user!: number;

  participation!:Participation;

  ratings!: Rating[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private service: EventService,
    private userService: UserService,
    private validatorService: ValidatorService,
  ) {
    
  }

  ngOnInit(): void {
    this.user = this.userService.getUserId();

    this.eventForm = this.formBuilder.group({
      user: this.user,
      title: ['', Validators.required],
      descrip: ['', Validators.required],
      date_start: ['', Validators.required],
      date_finish: ['', Validators.required],
      hour_start: ['', Validators.required],
      hour_finish: ['', Validators.required],
      place: ['', Validators.required],
      category: ['', Validators.required],
      max_participant: [0, Validators.required],
      participants: [0],
      available: [1],
    },{
      validators: this.validatorService.dateValidator()
    });

    if (this.id) {
      this.service.getEvent(this.id)
        .subscribe({
          next: (event) => {
            this.eventForm.patchValue(event);
            this.ratings = event.ratings;
          },
          error: (error) => {
            console.error('Error fetching event:', error);
          }
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  participate(idEvent:number){
    this.participation={
      user: this.id,
      event: idEvent,
    }
    this.service.participateEvent(this.participation).subscribe({
      next:(res)=>{
        Swal.fire({
          title: "Good job!",
          text: "You joined the event!",
          icon: "success"
        });
      }
    });
    
  }

}
