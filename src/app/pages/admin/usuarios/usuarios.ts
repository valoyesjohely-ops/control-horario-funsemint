import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth';

@Component({
  standalone: true,
  selector: 'app-admin-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class AdminUsuarios implements OnInit {
  users: any[] = [];
  loading = false;
  currentUid: string | null = null;
  searchTerm = '';
  roles = ['admin', 'supervisor', 'empleado'];

  constructor(private auth: AuthService) {
    this.auth.authState$.subscribe(u => {
      this.currentUid = u?.uid ?? null;
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    this.loading = true;
    this.users = await this.auth.getAllUsers();
    this.loading = false;
  }

  get filteredUsers() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.users;
    }
    return this.users.filter(u => {
      const email = (u.correo || '').toLowerCase();
      const name = (u.displayName || '').toLowerCase();
      const id = (u.id || '').toLowerCase();
      return email.includes(term) || name.includes(term) || id.includes(term);
    });
  }

  getUserLabel(user: any) {
    return user.correo || user.displayName || user.id;
  }

  isCurrentUser(user: any) {
    return this.currentUid && user.id === this.currentUid;
  }

  formatDate(value: any) {
    if (!value) {
      return '-';
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date.toLocaleDateString() : String(value);
  }

  async changeRole(user: any) {
    if (!this.currentUid) return;
    if (this.isCurrentUser(user)) {
      alert('No puedes cambiar tu propio rol desde aquí. Usa otro administrador.');
      return;
    }

    const ok = confirm(`Confirmar cambio de rol de ${this.getUserLabel(user)} a ${user.role}?`);
    if (!ok) return;

    const success = await this.auth.changeUserRoleWithAudit(user.id, user.role, this.currentUid);
    if (success) {
      alert('Rol actualizado');
      await this.loadUsers();
    } else {
      alert('Error actualizando rol');
    }
  }

}

