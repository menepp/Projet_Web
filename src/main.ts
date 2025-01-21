import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import du module HTTP

// Étendre appConfig avec les providers nécessaires
const extendedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Conserver les providers existants
    importProvidersFrom(HttpClientModule), // Ajout du HttpClientModule
  ],
};

bootstrapApplication(AppComponent, extendedAppConfig)
  .catch((err) => console.error(err));
