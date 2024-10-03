import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';
import { EmailValidatorService } from '../../validators/email-validator.service';
import { ValidatorService } from '../../validators/validator.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    private service: UserService,
    private router: Router,
    private emailValidator: EmailValidatorService,
    private fb: FormBuilder,
    private validator: ValidatorService
    ){}

  user: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: 'user',
    events:   [],
    notifications:   []
  };

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email],[this.emailValidator]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: [this.validator.equalFields('password', 'confirmPassword')] });

  invalidField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  get usernameErrorMsg(): string {
    const errors = this.myForm.get('username')?.errors;
    let errorMsg: string = '';
    if (errors) {
      if (errors['required']) {
        errorMsg = 'El username es obligatorio';
      } else if (errors['usernameTaken']) {
        errorMsg = 'El username ya está en uso';
      }
    }
    return errorMsg;
  }
  get emailErrorMsg(): string {
    const errors = this.myForm.get('email')?.errors;
    let errorMsg: string = '';
    if (errors) {
      if (errors['required']) {
        errorMsg = 'El email es obligatorio';
      } else if (errors['email']) {
        errorMsg = 'El email no tiene formato de correo';
      }
      else if (errors['emailTaken']) {
        errorMsg = 'El email ya está en uso';
      }
    }
    return errorMsg;
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
    
    if (this.myForm.invalid) {
      Swal.fire({
        title: "Oops...",
        text: "Please fill in all fields correctly!",
        icon: "error"
      });
      return;
    }

    // Creación del objeto user a partir del formulario
    const newUser: User = {
      id: 0,
      name: this.myForm.value.name,
      email: this.myForm.value.email,
      password: this.myForm.value.password,
      role: 'user',
      events:   [],
      notifications:   []    
    };

    this.service.register(newUser).subscribe({
      next:(response: User) => {
        Swal.fire({
          title: "Good job!",
          text: "You are registered!",
          icon: "success"
        });
        this.router.navigate(['/auth/login']);
      },
      error:(err) => {
        Swal.fire({
          title: "Oops...",
          text: "Registration failed!",
          icon: "error"
        });
      }
    });
  }

}
