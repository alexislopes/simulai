<script setup lang="ts">

const { equipes, jogos, sedes, rodada_atual } = useSimulador()

import type { Jogo } from '~/types/jogo';
import { filtraEmpates, filtraVitorias, golsContra, golsPro } from '../utils/tabela';

//  

const jogosRodada = computed(() => {
  return Object.values(jogos || {}).filter(jogo => jogo.rodada === rodada_atual)
})

const tabela = computed(() => {
  return useOrderBy(statsByEquipe.value, ['pontos', 'vitorias', 'diferenca_gols', 'gols_pro'], ['desc', 'desc', 'desc', 'desc'])
})

const statsByEquipe = computed(() => {
  return Object.keys(equipes).map(Number).map(equipeId => calculaStatsEquipe(equipeId))
})

function calculaStatsEquipe(equipe_id: number) {
  const jogos_equipe = filtraJogosEquipe(equipe_id)

  const vitorias = filtraVitorias(jogos_equipe, equipe_id)

  const empates = filtraEmpates(jogos_equipe, equipe_id)

  return {
    gols_pro: golsPro(jogos_equipe, equipe_id),
    gols_contra: golsContra(jogos_equipe, equipe_id),
    vitorias: vitorias.length,
    empates: empates.length,
    derrotas: Math.abs((vitorias.length + empates.length) - jogos_equipe.length),
    pontos: vitorias.length * 3 + empates.length,
    diferenca_gols: golsPro(jogos_equipe, equipe_id) - golsContra(jogos_equipe, equipe_id),
    equipe: equipes[equipe_id].nome_popular,
    partidas: jogos_equipe.length,
    clube_url: equipes[equipe_id].escudo.svg,
  }

}

function filtraJogosEquipe(equipe_id: number): Jogo[] {
  const contemEquipe = (jogo: Jogo) => jogo.equipe_mandante.id === equipe_id || jogo.equipe_visitante.id === equipe_id
  return Object.values(jogos || {}).filter(contemEquipe)//.filter(jogo => jogo.is_finalizado)
}

const columns: { key: string, label: string }[] = [
  {
    label: '#',
    key: 'posicao'
  },
  {
    label: 'Clube',
    key: 'equipe'
  },
  {
    label: 'PTS',
    key: 'pontos'
  },
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
    label: 'P',
    key: 'partidas'
  },
  {
    label: 'GP',
    key: 'gols_pro'
  },
  {
    label: 'GC',
    key: 'gols_contra'
  },
  {
    label: 'Diff',
    key: 'diferenca_gols'
  }
]

function badgeColor(position: number) {
  if (position >= 1 && position <= 6) return 'green'  // libertadores
  if (position >= 7 && position <= 8) return 'orange' // pré libertadores
  if (position >= 9 && position <= 14) return 'blue'  // sudamericana
  if (position >= 15 && position <= 16) return 'white'
  if (position >= 17 && position <= 20) return 'red'  // rebaixamento
}

</script>

<template>
  <div class="max-w-3xl flex flex-col gap-10">
    <div>
      <UCard>
        <UTable :columns="columns" :rows="tabela">
          <template #posicao-data="{ row }">
            <UBadge :color="badgeColor(tabela.indexOf(row) + 1)" :ui="{ rounded: 'rounded-full' }"
              :label="tabela.indexOf(row) + 1" />
          </template>
          <template #equipe-data="{ row }">
            <div class="flex gap-2 items-center">
              <img style="width: 20px;" :src="row.clube_url" alt="">
              <span class="font-bold">{{ row.equipe }}</span>
            </div>
          </template>
          <template #pontos-data="{ row }">
            <span class="font-bold">{{ row.pontos }}</span>
          </template>
        </UTable>
      </UCard>
    </div>
    <div>
      <UCard v-for="jogo in jogosRodada" :key="jogo.id">
        <div>
          <div class="flex gap-4 items-center">
            <span>{{ jogo.equipe_mandante.sigla }}</span>
            <img class="w-7" :src="jogo.equipe_mandante.escudo.svg" alt="">
            <UInput class="w-10" size="xl" type="number" max="9" v-model.number="jogo.placar_oficial_mandante"></UInput>
            X
            <UInput class="w-10" size="xl" type="number" max="9" v-model.number="jogo.placar_oficial_visitante">
            </UInput>
            <img class="w-7" :src="jogo.equipe_visitante.escudo.svg" alt="">
            <span>{{ jogo.equipe_visitante.sigla }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style>
td {
  @apply !py-2
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
