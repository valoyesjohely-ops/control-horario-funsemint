import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import { AuthService } from '../../../core/auth/services/auth';

@Component({

  selector: 'app-login',

  standalone: true,

  imports: [
    RouterLink,
    FormsModule,
    NgIf
  ],

  templateUrl: './login.html',

  styleUrls: ['./login.css']

})

export class LoginComponent {

  private authService = inject(AuthService);

  private router = inject(Router);

  correo = '';

  password = '';

  mensajeError = '';

  async iniciarSesion() {

    try {

      this.mensajeError = '';
      const userCredential = await this.authService.iniciarSesion(
        this.correo,
        this.password
      );

      const user = userCredential.user;
      let perfil = await this.authService.getUserData(user.uid);
      if (!perfil) {
        const created = await this.authService.ensureUserProfile(user);
        if (!created) {
          await this.authService.cerrarSesion();
          this.mensajeError = 'La cuenta existe en Auth pero no se pudo crear el perfil en Firestore. Intenta de nuevo.';
          return;
        }
        perfil = await this.authService.getUserData(user.uid);
      }

      this.router.navigate(['/dashboard']);

    } catch (error) {

      console.error(error);
      this.mensajeError = 'Credenciales inválidas o cuenta no registrada. Por favor regístrate.';

    }

  }

  async loginGoogle() {

    try {

      this.mensajeError = '';
      await this.authService.loginGoogle();
      this.router.navigate(['/dashboard']);

    } catch (error) {

      console.error(error);
      this.mensajeError = 'No se pudo iniciar sesión con Google. Asegúrate de que tu cuenta esté registrada o intenta de nuevo.';

    }

  }

}