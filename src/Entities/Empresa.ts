import type { Acao } from './Acao';
import type { Indicadores } from './Indicadores';

export type Empresa = {
    nome: string;
    indicadores: Indicadores;
    preferencia: number;
    acao: Acao;
};
