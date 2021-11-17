import { Injectable } from '@angular/core';
import { SimpleAlert } from 'src/models/interfaces.model';
import Swal from "sweetalert2";


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
  simpleAlert(data: SimpleAlert): Promise<any> {
   return Swal.fire({
      position: 'center',
      icon: data.icon,
      title: data.title,
      showConfirmButton: false,
      timer: data.timer
    })
  }
}
