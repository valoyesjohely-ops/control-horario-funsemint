import { Component } from '@angular/core';

@Component({
  selector: 'app-jornadas',

  standalone: true,

  imports: [],

  templateUrl: './jornadas.html',

  styleUrls: ['./jornadas.css']
})
export class Jornadas {

  jornadaActiva = true;

  estadoJornada = 'Activa';

  horaInicio = '08:00 AM';

  tiempoTrabajado = '03h 42m';

}