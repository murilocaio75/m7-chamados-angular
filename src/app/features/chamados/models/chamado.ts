export type Prioridade = "baixa" | "media" | "alta";

export type StatusChamado = "aberto" | "em_andamento" | "concluido";

export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  status: StatusChamado;
  responsavel?: string;
  criadoEm: string;
}

// Dados de um chamado ainda não cadastrado: o formulário não conhece o
// identificador nem a data de criação, que são atribuídos pela página.
export type NovoChamado = Omit<Chamado, "id" | "criadoEm">;
