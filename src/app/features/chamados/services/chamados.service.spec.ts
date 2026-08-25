import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Chamado, NovoChamado } from "../models/chamado";
import { ChamadosService } from "./chamados.service";

// Precisa acompanhar o apiUrl do serviço: é justamente o que estes testes
// verificam. Deixar a URL antiga aqui faria os 4 testes falharem.
const API = "https://m7-a7-chamados-api-5695.onrender.com/api/chamados";

// Os mesmos 3 chamados que a API devolve; aqui eles são a resposta simulada.
const CHAMADOS: Chamado[] = [
  {
    id: 1,
    titulo: "Erro ao acessar sistema",
    descricao: "Usuário não consegue realizar login.",
    prioridade: "alta",
    status: "aberto",
    responsavel: "Ana",
    criadoEm: "2026-08-10"
  },
  {
    id: 2,
    titulo: "Impressora sem conexão",
    descricao: "Impressora do setor financeiro está offline.",
    prioridade: "media",
    status: "em_andamento",
    responsavel: "Carlos",
    criadoEm: "2026-08-11"
  },
  {
    id: 3,
    titulo: "Instalação de software",
    descricao: "Solicitação de instalação de aplicativo.",
    prioridade: "baixa",
    status: "concluido",
    criadoEm: "2026-08-12"
  }
];

describe("ChamadosService", () => {
  let service: ChamadosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ChamadosService);
    http = TestBed.inject(HttpTestingController);
  });

  // Falha o teste se alguma requisição foi disparada e não foi respondida.
  afterEach(() => {
    http.verify();
  });

  it("deve listar os chamados", async () => {
    const promessa = service.listar();

    const requisicao = http.expectOne(API);
    expect(requisicao.request.method).toBe("GET");

    requisicao.flush(CHAMADOS);

    expect(await promessa).toHaveLength(3);
  });

  it("deve buscar um chamado por id", async () => {
    const promessa = service.buscarPorId(1);

    const requisicao = http.expectOne(`${API}/1`);
    expect(requisicao.request.method).toBe("GET");

    requisicao.flush(CHAMADOS[0]);

    expect((await promessa)?.titulo).toBe("Erro ao acessar sistema");
  });

  it("deve devolver undefined quando o chamado não existe", async () => {
    const promessa = service.buscarPorId(999);

    http.expectOne(`${API}/999`).flush(
      { erro: "Chamado não encontrado." },
      { status: 404, statusText: "Not Found" }
    );

    expect(await promessa).toBeUndefined();
  });

  it("deve adicionar um novo chamado", async () => {
    const novo: NovoChamado = {
      titulo: "Novo chamado",
      descricao: "Teste",
      prioridade: "media",
      status: "aberto"
    };

    const promessa = service.adicionar(novo);

    const requisicao = http.expectOne(API);
    expect(requisicao.request.method).toBe("POST");

    // O corpo enviado não contém id nem criadoEm: são do servidor.
    expect(requisicao.request.body).toEqual(novo);

    requisicao.flush(
      { ...novo, id: 1787610532699, criadoEm: "2026-08-24" },
      { status: 201, statusText: "Created" }
    );

    const criado = await promessa;

    expect(criado.id).toBe(1787610532699);
    expect(criado.titulo).toBe("Novo chamado");
  });
});
