import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthzService } from '../../core/auth/authz.service';
import { AuthService } from '../../core/auth/services/auth';

@Directive({ selector: '[hasRole]' })
export class HasRoleDirective implements OnDestroy {
  private hasView = false;
  private roles: string[] = [];
  private authSubscription: Subscription;

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private authz: AuthzService,
    private authService: AuthService
  ) {
    this.authSubscription = this.authService.authState$.subscribe(() => {
      this.updateView();
    });
  }

  @Input()
  set hasRole(value: string | string[]) {
    this.roles = Array.isArray(value) ? value : [value];
    this.updateView();
  }

  private async updateView() {
    if (!this.roles.length) {
      this.vcr.clear();
      this.hasView = false;
      return;
    }

    const allowed = await this.authz.hasAnyRole(this.roles);
    if (allowed && !this.hasView) {
      this.vcr.createEmbeddedView(this.tpl);
      this.hasView = true;
    } else if (!allowed && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
