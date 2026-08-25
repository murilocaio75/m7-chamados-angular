import { Component, input } from "@angular/core";
import { Chamado } from "../../models/chamado";
import { ChamadoCard } from "../chamado-card/chamado-card";

@Component({
  selector: "app-lista-chamados",
  imports: [ChamadoCard],
  templateUrl: "./lista-chamados.html",
  styleUrl: "./lista-chamados.css"
})
export class ListaChamados {
  chamados = input.required<Chamado[]>();
  carregando = input(false);
  erro = input<string | null>(null);
}
