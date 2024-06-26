import { Component } from '@angular/core';
import { _client_home } from '../../model/_client_consts';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <div class="flex-column align-items-center d-flex content-wrapper w-50">
        <div class="jumbotron content">
          <h1 class="display-4"><i class="fas fa-bug"></i> Page not found</h1>
          <p class="lead">
            We're sorry! The page that you're looking for can't be found. Please
            go back to the home page.
          </p>
          <p class="lead">
            <a class="btn btn-primary btn-lg" [routerLink]="home" type="button">
              <i class="fas fa-backward"> Home Page</i>
            </a>
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
export class NotfoundComponent {
  home: string = _client_home;
}
