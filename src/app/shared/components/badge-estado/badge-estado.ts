import { Component, Input } from '@angular/core';

import { NgClass } from '@angular/common';

@Component({
  selector: 'app-badge-estado',

  standalone: true,

  imports: [
    NgClass
  ],

  templateUrl: './badge-estado.html',

  styleUrls: ['./badge-estado.css']
})
export class BadgeEstado {

  @Input()
  estado!: string;

}
