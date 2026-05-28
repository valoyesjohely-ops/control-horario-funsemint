import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../core/auth/services/auth';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil implements OnInit {
  private auth = inject(Auth);
  private authService = inject(AuthService);

  usuario: any = null;
  usuarioRole: string | null = null;
  editandoPerfil = false;
  mostrandoCambioPassword = false;
  puedeBootstrapAdmin = false;
  bootstrapLoading = false;

  nombre = '';
  email = '';
  passwordActual = '';
  passwordNueva = '';
  passwordConfirm = '';

  ngOnInit() {
    this.cargarPerfil();
  }

  async cargarPerfil() {
    const user = this.auth.currentUser;
    if (user) {
      this.usuario = user;
      this.nombre = user.displayName || '';
      this.email = user.email || '';
      this.usuarioRole = await this.authService.getUserRole(user.uid);
      this.puedeBootstrapAdmin = !(await this.authService.hasAnyAdmin()) && this.usuarioRole !== 'admin';
    }
  }

  toggleEditPerfil() {
    this.editandoPerfil = !this.editandoPerfil;
  }

  toggleCambioPassword() {
    this.mostrandoCambioPassword = !this.mostrandoCambioPassword;
    this.resetearCambioPassword();
  }

  async guardarCambios() {
    try {
      if (this.usuario.displayName !== this.nombre) {
        await this.usuario.updateProfile({ displayName: this.nombre });
      }
      this.editandoPerfil = false;
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('Error al actualizar el perfil');
    }
  }

  async bootstrapAdmin() {
    if (!this.usuario) return;
    const ok = confirm('No existe ningún administrador. ¿Deseas convertir tu usuario en administrador?');
    if (!ok) return;
    this.bootstrapLoading = true;
    try {
      const success = await this.authService.changeUserRoleWithAudit(this.usuario.uid, 'admin', this.usuario.uid);
      if (success) {
        alert('Ahora eres administrador. Recarga la página para obtener acceso completo.');
        this.usuarioRole = 'admin';
        this.puedeBootstrapAdmin = false;
      } else {
        alert('No se pudo asignar el rol de administrador.');
      }
    } catch (error) {
      console.error('Error bootstrap admin:', error);
      alert('Error al asignar el rol de administrador.');
    } finally {
      this.bootstrapLoading = false;
    }
  }

  async cambiarContraseña() {
    if (!this.passwordNueva || !this.passwordConfirm) {
      alert('Completa los campos de contraseña');
      return;
    }

    if (this.passwordNueva !== this.passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.passwordNueva.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      // Nota: Para cambiar contraseña en Firebase, necesitas reautenticar primero
      // Por ahora mostramos un mensaje
      alert('Para cambiar contraseña, cierra sesión y usa "Olvidé contraseña" en el login');
      this.mostrandoCambioPassword = false;
      this.resetearCambioPassword();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar contraseña');
    }
  }

  resetearCambioPassword() {
    this.passwordActual = '';
    this.passwordNueva = '';
    this.passwordConfirm = '';
  }

  mapearRol(role: string | null): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrador',
      'supervisor': 'Supervisor',
      'empleado': 'Empleado'
    };
    return roleMap[role || 'empleado'] || 'Empleado';
  }
}
