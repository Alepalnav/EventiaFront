import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { delay, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService implements ValidationErrors{

  constructor(private http: HttpClient) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
   
    const email = control.value;
    return this.http.get<any[]>(`http://localhost:8080/userByEmail?email=${email}`)
  .pipe(
    delay(3000),
    map( resp => {
      return (resp.length === 0) ? null : { emailTaken: true}
    })

  )
  
  
}
}
