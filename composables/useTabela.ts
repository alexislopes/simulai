import { calculaStatsEquipe } from "~/utils/tabela"

const { data } = useApi()

export const useTabela = () => {

  const columns = computed(() => {
    const { width } = useWindowSize()

    const columnsMobile = [
      {
        label: '#',
        key: 'posicao'
      }, {
        label: 'Clube',
        key: 'equipe'
      }, {
        label: 'PTS',
        key: 'pontos'
      }, {
        label: 'P',
        key: 'partidas'
      }, {
        label: 'SG',
        key: 'diferenca_gols'
      }
    ]

    if (width.value < 768) {
      return columnsMobile
    }

    return columnsMobile.concat([
      {
        label: 'V',
        key: 'vitorias'
      },
      {
        label: 'E',
        key: 'empates'
      },
      {
        label: 'D',
        key: 'derrotas'
      },

      {
        label: 'GP',
        key: 'gols_pro'
      },
      {
        label: 'GC',
        key: 'gols_contra'
      },
    ])

  })


  const statsByEquipe = computed(() => {
    return Object.keys(data?.value?.equipes || {}).map(Number).map(equipeId => calculaStatsEquipe(Object.values(data.value.jogos), equipeId))
  })

  const tabela = computed(() => {
    return useOrderBy(statsByEquipe.value, ['pontos', 'vitorias', 'diferenca_gols', 'gols_pro'], ['desc', 'desc', 'desc', 'desc'])
  })

  return {
    columns,
    tabela
  }
}