import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  equalFields (field1: string, field2: string) : ValidatorFn{
    return (formControl: AbstractControl): ValidationErrors | null => {
      const control2 : FormControl = <FormControl>formControl.get(field2);
      const field1Input : string = formControl.get(field1)?.value;
      const field2Input : string = control2?.value;
  
      if (field1Input !== field2Input) {
        control2.setErrors({ nonEquals: true})
        return { nonEquals: true};
      }
      
      if(control2?.errors && control2.hasError('nonEquals')) {
        delete control2.errors['nonEquals'];
        control2.updateValueAndValidity();
      }
      // control2.setErrors(null)
      return null
    }
  }

  dateValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const startDate = formGroup.get('date_start')?.value;
      const endDate = formGroup.get('date_finish')?.value;
      const startTime = formGroup.get('hour_start')?.value;
      const endTime = formGroup.get('hour_finish')?.value;
      const today = new Date();

      if (!startDate || !endDate || !startTime || !endTime) {
        return null; // No se realiza validación si falta algún campo
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      // Verifica que la fecha de inicio sea mayor que hoy
      if (start <= today) {
        return { startDateInvalid: true };
      }

      // Verifica que la fecha final sea mayor que la fecha inicial
      if (end < start) {
        return { endDateInvalid: true };
      }

      // Si las fechas son iguales, verificar que la hora final sea mayor que la hora inicial
      if (start.getTime() === end.getTime()) {
        const startHour = this.convertToDateTime(startDate, startTime);
        const endHour = this.convertToDateTime(endDate, endTime);

        if (endHour <= startHour) {
          return { endTimeInvalid: true }; // Error si la hora final es menor o igual a la inicial
        }
      }

      return null;
    };
  }

  // Método para convertir fecha y hora en objeto Date para poder compararlos
  private convertToDateTime(date: string, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);
    return dateTime;
  }

}
