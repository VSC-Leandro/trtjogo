// Estado central do jogo. Sem acesso ao DOM — só dados.

export const game = {
  nome: '',
  sobrenome: '',
  genero: '',
  personalidade: '',
  bioma: 'Mata Atlântica',
  dia: 1,
};

export const res = {
  agua: 12,
  alim: 8,
  mat: 5,
  sab: 3,
};

export const SEASON_LEN = 15;
export const seasons = ['Primavera', 'Verão', 'Outono', 'Inverno'];
export const testSeasons = { 'Verão': true, 'Inverno': true };

export const bonusText = {
  Aventureiro: 'explora o mapa com mais alcance.',
  Resiliente: 'resiste melhor à escassez e ao clima.',
  Criativo: 'aprende saberes mais rápido.',
};
