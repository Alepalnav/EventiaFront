import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  constructor(
    private service: UserService,
  ){}

  isLogged = false;


  ngOnInit(): void {
    this.isLogged = this.service.getCurrentUser()!=null;
  }

}
