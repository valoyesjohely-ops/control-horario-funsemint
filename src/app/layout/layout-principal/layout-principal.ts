import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';

import { Navbar } from '../navbar/navbar';

import { Dashboard } from '../../pages/dashboard/dashboard';


@Component({
  selector: 'app-layout-principal',

  standalone: true,

  imports: [
    RouterOutlet,
    Sidebar,
    Navbar,
  ],

  templateUrl: './layout-principal.html',

  styleUrls: ['./layout-principal.css']
})
export class LayoutPrincipal {

}