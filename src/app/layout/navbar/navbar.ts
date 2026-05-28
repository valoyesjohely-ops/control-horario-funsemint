import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../core/auth/services/auth';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';

@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    HasRoleDirective
  ],

  templateUrl: './navbar.html',

  styleUrls: ['./navbar.css'],
})


export class Navbar {
  private authService = inject(AuthService);

  mostrarMenu = false;

  usuario: { nombre: string; rol: string } | null = null;

  titulo: string = 'Dashboard';

  subtitulo: string = '';

  actualizarTitulo(url: string): void {

  // DASHBOARD
  if (url.includes('dashboard')) {

    this.titulo = 'Dashboard';

    this.subtitulo =
      'Resumen general de actividad y control operativo en tiempo real';

  }

  // EMPLEADOS
  else if (url.includes('empleados')) {

    this.titulo = 'Empleados';

    this.subtitulo =
      'Gestión y supervisión general del personal registrado';

  }

  // MONITOREO
  else if (url.includes('monitoreo')) {

    this.titulo = 'Monitoreo operativo';

    this.subtitulo =
      'Supervisión y actividad laboral en tiempo real';

  }

  // JORNADAS
  else if (url.includes('jornadas')) {

    this.titulo = 'Jornadas';

    this.subtitulo =
      'Control y seguimiento de la jornada laboral de los empleados';

  }

  // DEFAULT
  else {

    this.titulo = 'Sistema de control horario';

    this.subtitulo =
      'Gestión empresarial y monitoreo operativo';

  }

}

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  async logout() {
    try {
      await this.authService.cerrarSesion();
      await this.router.navigate(['/login']);
    } catch (e) {
      console.error('Error cerrando sesión', e);
    }
  }

  constructor(private router: Router) {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        const url = this.router.url;

        this.actualizarTitulo(url);

      });

    // Escuchar cambios de auth
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.authService.getUserRole(user.uid).then(role => {
          this.usuario = {
            nombre: (user.displayName || user.email || 'Usuario') as string,
            rol: this.mapearRol(role)
          };
        });
      } else {
        this.usuario = null;
      }
    });

  }

  private mapearRol(role: string | null): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrador',
      'supervisor': 'Supervisor',
      'empleado': 'Empleado'
    };
    return roleMap[role || 'empleado'] || 'Empleado';

  }
}