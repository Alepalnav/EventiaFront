import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private service: UserService,
    private router: Router
  ){}

  isLogged = false;
  isAdmin = false;


  ngOnInit(): void {
    this.isLogged = this.service.getCurrentUser()!=null;
    this.isAdmin = this.service.isAdmin();
  }

  logout():void{
    this.service.logout();
    Swal.fire({
      title: "Good job!",
      text: "You are logout!",
      icon: "success",
      showConfirmButton: true, // Mostrar el botón de confirmación
      confirmButtonText: "OK" // Personalizar el texto del botón de confirmación
    }).then((result) => {
      if (result.isConfirmed) { // Verificar si se ha confirmado
        this.router.navigate(['/']).then(() => {
          window.location.href = window.location.href;
        });
      }
    });
  }

}
