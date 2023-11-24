import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {GameplayService} from "./gameplay.service";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), GameplayService]
};
