export const ATIVACOES_INFO = {
  1: { nome: 'Fotos' },
  2: { nome: 'Oculos' },
  3: { nome: 'Fruit Ninja' },
  4: { nome: 'Controle (Tahto)' },
  5: { nome: 'Realidade aumentada' }
}

export const ATIVACAO_IDS = Object.keys(ATIVACOES_INFO).map(Number).sort((a, b) => a - b)

export const getNomeAtivacao = (ativacaoId) =>
  ATIVACOES_INFO[ativacaoId]?.nome || `Ativação ${ativacaoId}`


