import { Component } from '@angular/core';

import { BadgeEstado } from '../badge-estado/badge-estado';

@Component({
  selector: 'app-tabla-empleados',

  standalone: true,

  imports: [
    BadgeEstado
  ],

  templateUrl: './tabla-empleados.html',

  styleUrls: ['./tabla-empleados.css']
})
export class TablaEmpleados {

  empleados = [

    {
      nombre: 'Carlos Rodríguez',
      cargo: 'Desarrollador Frontend',
      estado: 'Activo',
      entrada: '08:00 AM',
      ubicacion: 'Bogotá',
      actividad: 'Trabajando'
    },

    {
      nombre: 'Ana Martínez',
      cargo: 'Diseñadora UX/UI',
      estado: 'Pausa',
      entrada: '08:15 AM',
      ubicacion: 'Medellín',
      actividad: 'En descanso'
    },

    {
      nombre: 'Laura Gómez',
      cargo: 'Recursos Humanos',
      estado: 'Inactivo',
      entrada: '09:00 AM',
      ubicacion: 'Cali',
      actividad: 'Sin actividad'
    },

    {
      nombre: 'David Torres',
      cargo: 'Administrador',
      estado: 'Activo',
      entrada: '07:45 AM',
      ubicacion: 'Bogotá',
      actividad: 'Monitoreando'
    }

  ];

}