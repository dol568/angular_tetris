import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { _client_home } from '../../model/_client_consts';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <div class="flex-column align-items-center d-flex content-wrapper w-50">
        <div class="jumbotron content">
          <h1 class="display-4">
            <i class="fas fa-wrench"></i> Server Error 500
          </h1>
          <p class="lead">
            We're sorry! Please try again later or feel free to contact us.
          </p>
          <br />
          <p class="lead">
            <a class="btn btn-warning btn-lg" [routerLink]="home" role="button">
              <i class="fas fa-backward"></i> Home Page</a
            >
          </p>
        </div>
      </div>
    </div>
  `,
  styles: `
.container {
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}

.content-wrapper {
text-align: center;
}
`,
})
export class ServerErrorComponent {
  home: string = _client_home;
}
