import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor } from './app/Service/auth.interceptor';
import '@angular/common/locales/global/pt';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),

    // provideHttpClient(withInterceptors([authInterceptor]))
  ]

});