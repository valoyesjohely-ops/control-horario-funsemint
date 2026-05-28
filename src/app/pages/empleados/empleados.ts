import { Component } from '@angular/core';

import { TablaEmpleados } from '../../shared/components/tabla-empleados/tabla-empleados';

import { CardEstadistica } from '../../shared/components/card-estadistica/card-estadistica';

@Component({
  selector: 'app-empleados',

  standalone: true,

  imports: [
    TablaEmpleados,
    CardEstadistica
  ],

  templateUrl: './empleados.html',

  styleUrls: ['./empleados.css']
})
export class Empleados {

}