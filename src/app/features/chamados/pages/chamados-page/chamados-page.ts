import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from "@angular/core";
import { FiltroChamados } from "../../components/filtro-chamados/filtro-chamados";
import { ListaChamados } from "../../components/lista-chamados/lista-chamados";
import { NovoChamadoForm } from "../../components/novo-chamado-form/novo-chamado-form";
import { Chamado, NovoChamado, StatusChamado } from "../../models/chamado";
import { ChamadosService } from "../../services/chamados.service";

@Component({
  selector: "app-chamados-page",
  imports: [FiltroChamados, ListaChamados, NovoChamadoForm],
  templateUrl: "./chamados-page.html",
  styleUrl: "./chamados-page.css"
})
export class ChamadosPage implements OnInit {
  private readonly chamadosService = inject(ChamadosService);

  readonly chamados = signal<Chamado[]>([]);
  readonly pesquisa = signal("");
  readonly filtroStatus = signal<StatusChamado | "todos">("todos");

  readonly mostrarFormulario = signal(false);

  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly chamadosFiltrados = computed(() => {
    const termo = this.pesquisa().trim().toLowerCase();
    const status = this.filtroStatus();

    return this.chamados().filter(chamado => {
      const correspondeTexto =
        termo === "" ||
        chamado.titulo.toLowerCase().includes(termo) ||
        chamado.descricao.toLowerCase().includes(termo);

      const correspondeStatus =
        status === "todos" || chamado.status === status;

      return correspondeTexto && correspondeStatus;
    });
  });

  ngOnInit(): void {
    void this.carregarChamados();
  }

  async carregarChamados(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados = await this.chamadosService.listar();
      this.chamados.set(dados);
    } catch {
      this.erro.set("Não foi possível carregar os chamados.");
    } finally {
      this.carregando.set(false);
    }
  }

  atualizarPesquisa(valor: string): void {
    this.pesquisa.set(valor);
  }

  atualizarStatus(valor: StatusChamado | "todos"): void {
    this.filtroStatus.set(valor);
  }

  alternarFormulario(): void {
    this.mostrarFormulario.update(valor => !valor);
  }

  async adicionarChamado(dados: NovoChamado): Promise<void> {
    // O id e a data de criação são atribuídos pela API (POST /api/chamados),
    // que é a única fonte capaz de garantir unicidade entre clientes.
    await this.chamadosService.adicionar(dados);

    this.mostrarFormulario.set(false);

    // Relê do serviço: o que aparece na tela prova que o dado entrou lá.
    await this.carregarChamados();
  }
}
