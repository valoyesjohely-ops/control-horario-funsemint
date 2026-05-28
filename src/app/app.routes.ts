import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';

import { Empleados } from './pages/empleados/empleados';

import { Monitoreo } from './pages/monitoreo/monitoreo';

import { Jornadas } from './pages/jornadas/jornadas';

import { Perfil } from './pages/perfil/perfil';
import { AdminUsuarios } from './pages/admin/usuarios/usuarios';

import { LayoutPrincipal } from './layout/layout-principal/layout-principal';

import { LoginComponent } from './pages/auth/login/login';

import { Registro } from './pages/auth/registro/registro';

import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [

  // AUTH

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'registro',
    component: Registro
  },

  // SISTEMA

  {

    path: '',

    component: LayoutPrincipal,

    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'empleados',
        component: Empleados,
        data: { roles: ['admin', 'supervisor'] }
      },

      {
        path: 'monitoreo',
        component: Monitoreo,
        data: { roles: ['admin', 'supervisor'] }
      },

      {
        path: 'jornadas',
        component: Jornadas
      },

      {
        path: 'perfil',
        component: Perfil
      },

      {
        path: 'admin/usuarios',
        component: AdminUsuarios,
        data: { roles: ['admin'] }
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]

  }

];