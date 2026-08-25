import { Component, computed, output, signal } from '@angular/core';
import { NovoChamado, Prioridade, StatusChamado } from '../../models/chamado';

@Component({
  selector: 'app-novo-chamado-form',
  imports: [],
  templateUrl: './novo-chamado-form.html',
  styleUrl: './novo-chamado-form.css',
})
export class NovoChamadoForm {
  readonly titulo = signal('');
  readonly descricao = signal('');
  readonly prioridade = signal<Prioridade>('media');
  readonly status = signal<StatusChamado>('aberto');
  readonly responsavel = signal('');

  readonly formValido = computed(() => this.titulo().trim() !== '');

  criar = output<NovoChamado>();

  alterarTitulo(event: Event): void {
    this.titulo.set((event.target as HTMLInputElement).value);
  }

  alterarDescricao(event: Event): void {
    this.descricao.set((event.target as HTMLTextAreaElement).value);
  }

  alterarPrioridade(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value as Prioridade;

    this.prioridade.set(valor);
  }

  alterarStatus(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value as StatusChamado;

    this.status.set(valor);
  }

  alterarResponsavel(event: Event): void {
    this.responsavel.set((event.target as HTMLInputElement).value);
  }

  enviar(event: Event): void {
    event.preventDefault();

    if (!this.formValido()) {
      return;
    }

    const responsavel = this.responsavel().trim();

    this.criar.emit({
      titulo: this.titulo().trim(),
      descricao: this.descricao().trim(),
      prioridade: this.prioridade(),
      status: this.status(),
      responsavel: responsavel === '' ? undefined : responsavel,
    });

    this.limpar();
  }

  private limpar(): void {
    this.titulo.set('');
    this.descricao.set('');
    this.prioridade.set('media');
    this.status.set('aberto');
    this.responsavel.set('');
  }
}
