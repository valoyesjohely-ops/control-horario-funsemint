import { Component } from '@angular/core';

import { CardEstadistica } from '../../shared/components/card-estadistica/card-estadistica';

import { TablaEmpleados } from '../../shared/components/tabla-empleados/tabla-empleados';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CardEstadistica,
    TablaEmpleados,
  ],

  templateUrl: './dashboard.html',

  styleUrls: ['./dashboard.css']
})
export class Dashboard {

}