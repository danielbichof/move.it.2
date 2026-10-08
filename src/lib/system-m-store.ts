'use client'

import { useSyncExternalStore } from 'react'
import { emptySystemM, parseSystemM, type SystemM } from '@/src/lib/system-m'

// Apenas dados do Sistema M. Nada de senha, token ou qualquer dado sensível aqui.
// A chave mantém a grafia antiga de propósito: trocá-la apagaria os dados já salvos
const storageKey = 'moveit:sistema-m-v2'

const listeners = new Set<() => void>()

let cachedRaw: string | null = null
let cachedState = emptySystemM
// Gravação falhou (cota cheia, modo privado): o estado em memória passa a valer
let persistFailed = false

function readState() {
  if (persistFailed) return cachedState

  let raw: string | null

  try {
    raw = localStorage.getItem(storageKey)
  } catch {
    // Sem acesso ao localStorage: o estado vive só em memória
    return cachedState
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedState = parseSystemM(raw)
  }

  return cachedState
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export function updateSystemM(update: (state: SystemM) => SystemM) {
  cachedState = update(readState())
  cachedRaw = JSON.stringify(cachedState)

  try {
    localStorage.setItem(storageKey, cachedRaw)
  } catch {
    persistFailed = true
  }

  for (const listener of listeners) listener()
}

export function useSystemM() {
  return useSyncExternalStore(subscribe, readState, () => emptySystemM)
}

// false no servidor e na hidratação: evita mostrar estado vazio antes de ler o localStorage
export function useSystemMReady() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
