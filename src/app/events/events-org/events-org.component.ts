import { Component } from '@angular/core';
import { User } from '../../interfaces/user';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Event } from '../../interfaces/event';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Notification } from '../../interfaces/notification';

@Component({
  selector: 'app-events-org',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-org.component.html',
  styleUrl: './events-org.component.css'
})
export class EventsOrgComponent {

  events: Event[]=[];
  user!:User;
  notification!:Notification;
  id:number=0;

  today = new Date();

  constructor(
    private servicio: EventService,
    private userService: UserService,
    private router: Router

  ){}

  ngOnInit(): void {
      this.id=this.userService.getCurrentUser().id;
      this.servicio.eventsByOrg(this.id).subscribe({
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

  goToEdit(id:number){
    this.router.navigate(['/events/event',id]);
  }

  participants(id:number){
    let participants: User[] = [];
    this.servicio.getParticipants(id).subscribe({
      next:(res)=>{
        participants = res;

        let participantsList = `<ul>`;
        res.forEach((participant) => {
          participantsList += `
            <li>
              ${participant.name}
              <button class="btn btn-warning mx-2" onclick="triggerParticipantAction(${participant.id}, ${id})">Notify</button>
            </li>
          `;
        });
        participantsList += `</ul>`;

        Swal.fire({
          title: 'Participants',
          html: participantsList,
          icon: "info",
          didOpen: () => {
            // Define la función `triggerParticipantAction` dentro de `didOpen` para evitar problemas de contexto
            (window as any).triggerParticipantAction = (participantId: number, eventId: number) => {
              this.notify(participantId, eventId);

              // Swal.close();
            };
          },
          willClose: () => {
            // Limpia `triggerParticipantAction` para evitar fugas de memoria
            delete (window as any).triggerParticipantAction;
          }
        });
      }
    })
  }

  notify(idUser:number, idEvent:number){
    Swal.fire({
      title: 'Escribe un mensaje',
      input: 'text',  // Muestra un campo de entrada de texto
      inputPlaceholder: 'Escribe tu mensaje aquí...',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const mensaje = result.value;
        this.notification = {
            user: idUser,
            event: idEvent,
            message: mensaje
        };

        this.servicio.addNotification(this.notification).subscribe({
          next:(res)=>{
            Swal.fire({
              title: 'Good job!',
              text: 'You send the notification!',
              icon: 'success'
            });
          }
        })
        // Aquí puedes implementar la lógica para enviar el mensaje o realizar alguna acción
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log('Acción cancelada');
      }
    });

  }

}
