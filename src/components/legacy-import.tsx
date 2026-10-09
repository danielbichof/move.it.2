'use client'

import { useEffect } from 'react'
import { importLegacy } from '@/src/lib/system-m-actions'

// Chave do Sistema M na época em que ele vivia só no navegador
const storageKey = 'moveit:sistema-m-v2'

let started = false

// Leva para o banco o que este navegador ainda guarda (localStorage e cookies de progresso).
// A chave só é apagada depois que o servidor confirma: falha na importação não perde nada
export default function LegacyImport({ hasLegacyCookies }: { hasLegacyCookies: boolean }) {
  useEffect(() => {
    if (started) return

    let raw: string | null = null

    try {
      raw = localStorage.getItem(storageKey)
    } catch {
      // Sem acesso ao localStorage não há o que importar dele
    }

    if (!raw && !hasLegacyCookies) return

    started = true

    importLegacy(raw)
      .then(() => {
        try {
          localStorage.removeItem(storageKey)
        } catch {
          // A próxima visita tenta de novo; importar duas vezes não duplica
        }
      })
      .catch(() => {
        started = false
      })
  }, [hasLegacyCookies])

  return null
}
