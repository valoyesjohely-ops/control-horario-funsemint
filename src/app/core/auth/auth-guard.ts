import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './services/auth';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const authService = inject(AuthService);

  // Verificar si hay usuario autenticado
  if (!auth.currentUser) {
    return router.parseUrl('/login');
  }

  // Verificar que el usuario tenga perfil en Firestore
  let userData = await authService.getUserData(auth.currentUser.uid);
  if (!userData) {
    const created = await authService.ensureUserProfile(auth.currentUser);
    if (!created) {
      await authService.cerrarSesion();
      return router.parseUrl('/login');
    }
    userData = await authService.getUserData(auth.currentUser.uid);
  }

  // Verificar si la ruta requiere roles específicos
  const requiredRoles = route.data['roles'] as string[] | undefined;
  
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = await authService.getUserRole(auth.currentUser.uid);
    
    if (!userRole || !requiredRoles.includes(userRole)) {
      return router.parseUrl('/dashboard');
    }
  }

  return true;
};
