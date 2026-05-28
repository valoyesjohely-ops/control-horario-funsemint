import { Injectable, inject } from '@angular/core';
import { AuthService } from './services/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthzService {
  private authService = inject(AuthService);

  async hasAnyRole(roles: string[] | string): Promise<boolean> {
    const wanted = Array.isArray(roles) ? roles : [roles];
    
    // Espera a que Firebase restaure la sesión
    const user = await firstValueFrom(this.authService.authState$);
    
    if (!user) return false;
    const role = await this.authService.getUserRole(user.uid);
    return !!role && wanted.includes(role);
  }

  async getRole(): Promise<string | null> {
    // Espera a que Firebase restaure la sesión
    const user = await firstValueFrom(this.authService.authState$);
    
    if (!user) return null;
    return await this.authService.getUserRole(user.uid);
  }
}