import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/services/auth';

@Component({

  selector: 'app-registro',

  standalone: true,

  imports: [FormsModule, RouterLink, NgIf],

  templateUrl: './registro.html',

  styleUrls: ['./registro.css']

})

export class Registro {

  private authService = inject(AuthService);
  private router = inject(Router);

  correo = '';
  password = '';
  mensajeError = '';

  async registrarse() {
    try {
      this.mensajeError = '';
      await this.authService.registrarse(this.correo, this.password);
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
      this.mensajeError = 'Error al registrar la cuenta. Revisa los datos e inténtalo de nuevo.';
    }
  }

  async registrarseGoogle() {
    try {
      this.mensajeError = '';
      await this.authService.loginGoogle();
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error(error);
      this.mensajeError = 'Error al registrarse con Google. Intenta de nuevo.';
    }
  }

}
