import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Chamado } from "../../models/chamado";
import { ChamadosService } from "../../services/chamados.service";

@Component({
  selector: "app-chamado-detalhe-page",
  imports: [RouterLink],
  templateUrl: "./chamado-detalhe-page.html",
  styleUrl: "./chamado-detalhe-page.css"
})
export class ChamadoDetalhePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ChamadosService);

  readonly chamado = signal<Chamado | undefined>(undefined);
  readonly carregando = signal(true);

  ngOnInit(): void {
    void this.carregar();
  }

  private async carregar(): Promise<void> {
    const id = Number(
      this.route.snapshot.paramMap.get("id")
    );

    // A API responde 400 a id não numérico, e o serviço só converte 404 em
    // undefined. Sem esta guarda, /chamados/abc viraria rejeição não tratada
    // e a página ficaria presa em "Carregando..." para sempre.
    if (!Number.isFinite(id)) {
      this.carregando.set(false);
      return;
    }

    try {
      const chamado = await this.service.buscarPorId(id);
      this.chamado.set(chamado);
    } finally {
      this.carregando.set(false);
    }
  }
}
