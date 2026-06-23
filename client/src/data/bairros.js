// Dados do mapa: cada bairro de Queimados é um hexágono.
// Layout aproximado (oeste -> leste). [coluna, linha, nome, estado inicial]

export const STATE = {
  ferida:      { fill: '#7C5C4C', text: '#F3F0E7', label: 'Ferida',           hint: 'Terra degradada. Selecione e use Regenerar.' },
  recuperacao: { fill: '#C9962F', text: '#1A1305', label: 'Em recuperação',   hint: 'Brotando. Regenere de novo para revivê-la.' },
  viva:        { fill: '#5DE08A', text: '#0E1620', label: 'Viva',             hint: 'Terra saudável, gerando recursos.' },
  agua:        { fill: '#3A8DA0', text: '#F3F0E7', label: 'Água',             hint: "Curso d'água. Área natural a preservar." },
  mata:        { fill: '#2E7D4F', text: '#EAF7EE', label: 'Mata preservada',  hint: 'Remanescente de Mata Atlântica. Preserve.' },
};

const RAW = [
  [0,1,'Jardim Alvorada','ferida'],[0,2,'Campo Alegre','ferida'],[0,3,'Parque Industrial','ferida'],
  [1,0,'Vila Vitória','ferida'],[1,1,'Parque Sarandi','ferida'],[1,2,'Santa Rosa','ferida'],[1,3,'Coimbra','ferida'],
  [2,0,'Vila Central','ferida'],[2,1,'Jardim Queimados','ferida'],[2,2,'São Francisco','recuperacao'],[2,3,'Austin','ferida'],[2,4,'Santo Expedito','ferida'],
  [3,0,'Jardim Tri Campeão','ferida'],[3,1,'Vista Alegre','recuperacao'],[3,2,'São Manoel','ferida'],[3,3,'Piabas','agua'],[3,4,'Coqueiros','ferida'],
  [4,0,'Carmo','ferida'],[4,1,'Vila Camorim','ferida'],[4,2,'Vila do Tinguá','mata'],[4,3,'São Cristóvão','ferida'],[4,4,'Santo Antônio','ferida'],
  [5,0,'Morro da Paz','ferida'],[5,1,'Centro','viva'],[5,2,'Jardim São Miguel','ferida'],[5,3,'Meu Ranchinho','ferida'],[5,4,'Vila Americana','ferida'],
  [6,0,'Primavera','ferida'],[6,1,'Aliança','ferida'],[6,2,'Pacaembu','ferida'],[6,3,'Vila São João','ferida'],[6,4,'Parque Santiago','ferida'],
  [7,0,'Paraíso','ferida'],[7,1,'Santa Sofia','ferida'],[7,2,'Nova Cidade','ferida'],[7,3,'Inconfidência','ferida'],
];

// Vira lista de objetos mutáveis (col, row, name, state + campos preenchidos no build)
export const HEXES = RAW.map(([col, row, name, state]) => ({ col, row, name, state }));
