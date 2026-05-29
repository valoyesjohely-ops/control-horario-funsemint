import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, take, switchMap } from 'rxjs/operators';
import { UrlTree } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ✅ Usar authState$ que espera a que Firebase restaure la sesión
  return authService.authState$.pipe(
    take(1),
    switchMap(async (user) => {
      // Si no hay usuario, redirigir a login
      if (!user) {
        return router.parseUrl('/login');
      }

      // Verificar que el usuario tenga perfil en Firestore
      let userData = await authService.getUserData(user.uid);
      if (!userData) {
        const created = await authService.ensureUserProfile(user);
        if (!created) {
          await authService.cerrarSesion();
          return router.parseUrl('/login');
        }
        userData = await authService.getUserData(user.uid);
      }

      // Verificar si la ruta requiere roles específicos
      const requiredRoles = route.data['roles'] as string[] | undefined;
      
      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = await authService.getUserRole(user.uid);
        
        if (!userRole || !requiredRoles.includes(userRole)) {
          return router.parseUrl('/dashboard');
        }
      }

      return true;
    }),
    map(result => result === true || result instanceof UrlTree ? result : false)
  );
};
