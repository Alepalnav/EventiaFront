import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  constructor(private service: UserService){}

  users!: User[];

  ngOnInit(): void {
      this.service.getUsers().subscribe({
        next:(res)=>{
          this.users = res;
        }
      })
  }

  changeRol(id:number){
    this.service.changeRol(id).subscribe({
      next:()=>{
        this.service.getUsers().subscribe({
          next:(res)=>{
            this.users = res;
          }
        })
      }
    })
  }

}
