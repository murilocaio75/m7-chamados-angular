import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Chamado, NovoChamado } from "../models/chamado";

@Injectable({
  providedIn: "root"
})
export class ChamadosService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    "https://m7-a7-chamados-api-5695.onrender.com/api/chamados";

  listar(): Promise<Chamado[]> {
    return firstValueFrom(this.http.get<Chamado[]>(this.apiUrl));
  }

  async buscarPorId(id: number): Promise<Chamado | undefined> {
    try {
      return await firstValueFrom(
        this.http.get<Chamado>(`${this.apiUrl}/${id}`)
      );
    } catch (erro) {
      // Mantém o contrato da Aula 6: chamado inexistente devolve undefined,
      // não erro. Qualquer outra falha continua subindo.
      if (erro instanceof HttpErrorResponse && erro.status === 404) {
        return undefined;
      }

      throw erro;
    }
  }

  // O id e a data de criação passam a ser responsabilidade do servidor, então
  // o cliente envia apenas o que o formulário coletou.
  adicionar(dados: NovoChamado): Promise<Chamado> {
    return firstValueFrom(this.http.post<Chamado>(this.apiUrl, dados));
  }
}
