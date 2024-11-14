import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { EventService } from '../../services/event.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ValidatorService } from '../../validators/validator.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule,RouterOutlet,ReactiveFormsModule,CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent implements OnInit{

  @Input('id') id: number = 0;
  edit: boolean = false;
  exito: boolean = false;
  eventForm!: FormGroup;
  user!: number;

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
        available: [1]
      },{
        validators: this.validatorService.dateValidator()
      }
    );

    if (this.id) {
      this.service.getEvent(this.id)
        .subscribe({
          next: (event) => {
            this.eventForm.patchValue(event);
            this.edit = true;
          },
          error: (error) => {
            console.error('Error fetching event:', error);
          }
        });
    }
  }


  submit(): void {
    if (this.eventForm.valid) { // Validar si el formulario es válido antes de enviar
      if (this.edit) {
        this.service.editEvent(this.id, this.eventForm.value)
          .subscribe({
            next: (product) => {
              this.exito = true;
              this.eventForm.reset();
              Swal.fire({
                title: 'Good job!',
                text: 'You edited the event!',
                icon: 'success'
              });
              this.router.navigate(['/events/manage']);
            },
            error: (error) => {
              console.error('Error updating product:', error);
            }
          });
      } else {
          this.service.addEvent(this.eventForm.value)
            .subscribe({
              next: (product) => {
                this.exito = true;
                this.eventForm.reset();
                Swal.fire({
                  title: 'Good job!',
                  text: 'You added a new event!',
                  icon: 'success'
                });
                this.router.navigate(['/events']);
              },
              error: (error) => {
                console.error('Error adding event:', error);
              }
            });
          }
    } else {
      // Manejar el caso donde el formulario no es válido (campos requeridos faltantes)
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out all required fields.',
        icon: 'error'
      });
    }
  }

  
  goBack(): void {
    this.router.navigate(['/events']);
  }



}
