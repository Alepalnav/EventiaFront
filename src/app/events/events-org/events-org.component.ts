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
        }
      })
      
  }

  // details(id:number){
  //   this.servicio.getEvent(id).subscribe({
  //     next:(res)=>{
  //       Swal.fire({
  //         title: res.title,
  //         html: `<p><strong>Description:</strong> ${res.descrip}</p>
  //               <p><strong>Place:</strong> ${res.place}</p>
  //               <p><strong>Date:</strong> ${res.date_start}  ${res.hour_start}</p>`,
  //         icon: "info"
  //       });
        
  //     }
  //   })
  // }

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

  participants(id: number) {
    let participants: User[] = [];
    this.servicio.getParticipants(id).subscribe({
      next: (res) => {
        participants = res;
  
        let participantsList = `
          <div class="container">
            <div class="row">
        `;
        res.forEach((participant) => {
          participantsList += `
            <div class="col-12 mb-3">
              <div class="card shadow-sm">
                <div class="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="card-title mb-0">${participant.name}</h5>
                    <small class="text-muted">Participant ID: ${participant.id}</small>
                  </div>
                  <button class="btn btn-warning" onclick="triggerParticipantAction(${participant.id}, ${id})">
                    <i class="bi bi-bell"></i> Notify
                  </button>
                </div>
              </div>
            </div>
          `;
        });
        participantsList += `</div></div>`;
  
        Swal.fire({
          title: 'Participants',
          html: participantsList,
          icon: "info",
          width: '600px',
          didOpen: () => {
            // Define la función `triggerParticipantAction` dentro de `didOpen`
            (window as any).triggerParticipantAction = (participantId: number, eventId: number) => {
              this.notify(participantId, eventId);
            };
          },
          willClose: () => {
            // Limpia `triggerParticipantAction` para evitar fugas de memoria
            delete (window as any).triggerParticipantAction;
          },
          confirmButtonText: "Close",
          confirmButtonColor: "#3085d6",
        });
      }
    });
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

  deleteEvent(id: number) {
    // Mostrar un SweetAlert para confirmar antes de proceder
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this event? This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Inicia el cargador (opcional si estás usando ngx-ui-loader)
  
        // Llama al servicio para eliminar el evento
        this.servicio.deleteEvent(id).subscribe({
          next: (res) => {

  
            // Mostrar mensaje de éxito
            Swal.fire({
              title: 'Deleted!',
              text: 'The event has been deleted successfully.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            });
  
            // Actualiza la lista de eventos
            this.servicio.eventsByOrg(this.id).subscribe({
              next:(res)=>{
                this.events=res;
              }
            })
          },
          error: (err) => {
  
            // Mostrar mensaje de error
            Swal.fire({
              title: 'Error!',
              text: 'No puede eliminarse un evento ya terminado',
              icon: 'error',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }
  

}
