import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {_client_home} from "../../model/_const_vars";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss'
})
export class NotfoundComponent {
  home: string = _client_home;
}
