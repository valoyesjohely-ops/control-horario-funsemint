import { Component, Input } from '@angular/core';

import { NgClass } from '@angular/common';
@Component({
  selector: 'app-card-estadistica',

  standalone: true,

  imports: [
    NgClass
  ],

  templateUrl: './card-estadistica.html',

  styleUrls: ['./card-estadistica.css']
})
export class CardEstadistica {

  @Input()
  titulo!: string;

  @Input()
  valor!: string;

  @Input()
  descripcion!: string;

  @Input()
  tendencia!: string;

  @Input()
  positiva: boolean = true;

}