// Sistema M: de onde vem o foco do ciclo. Não guarda XP, level nem desafios (isso fica nos cookies).

export type Pillar = 'estabilidade' | 'crescimento' | 'laboratorio'

export interface Item {
  id: string
  pillar: Pillar
  title: string
  createdAt: string
}

export interface InboxItem {
  id: string
  text: string
  createdAt: string
}

// Hábito do dia: `doneOn` guarda a data (YYYY-MM-DD) em que foi marcado
export interface Habit {
  id: string
  name: string
  doneOn: string | null
}

export interface SystemM {
  version: 2
  userName: string
  cycleMinutes: number
  items: Item[]
  focusId: string | null
  inbox: InboxItem[]
  habits: Habit[]
}

// Duração do ciclo: presets do design mais um intervalo livre em passos de 5
export const defaultCycleMinutes = 35
export const cyclePresets = [15, 25, 35, 45, 60]
export const minCycleMinutes = 10
export const maxCycleMinutes = 120
export const cycleStepMinutes = 5

export function isCycleMinutes(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= minCycleMinutes &&
    value <= maxCycleMinutes &&
    value % cycleStepMinutes === 0
  )
}

export const pillars: { id: Pillar; name: string; description: string }[] = [
  { id: 'estabilidade', name: 'Estabilidade', description: 'O que mantém a vida funcionando' },
  { id: 'crescimento', name: 'Crescimento', description: 'Onde você quer evoluir de propósito' },
  {
    id: 'laboratorio',
    name: 'Laboratório',
    description: 'Hobbies, experimentos e projetos próprios'
  }
]

export const emptySystemM: SystemM = {
  version: 2,
  userName: '',
  cycleMinutes: defaultCycleMinutes,
  items: [],
  focusId: null,
  inbox: [],
  habits: []
}

export function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function focusItem(state: SystemM) {
  return state.items.find(item => item.id === state.focusId)
}

// Dia local em ISO curto: o hábito marcado ontem volta a aparecer aberto hoje
export function today() {
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')

  return `${now.getFullYear()}-${month}-${day}`
}

export function isHabitDone(habit: Habit) {
  return habit.doneOn === today()
}

// Validação do que vem do localStorage: item inválido é descartado, estrutura inválida vira vazio

type Raw = Record<string, unknown>

function isRaw(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isText(value: unknown): value is string {
  return typeof value === 'string'
}

function isDate(value: unknown): value is string {
  return isText(value) && !Number.isNaN(Date.parse(value))
}

function list<T>(value: unknown, isValid: (item: Raw) => boolean) {
  return Array.isArray(value) ? (value.filter(item => isRaw(item) && isValid(item)) as T[]) : []
}

function isItem(item: Raw) {
  return (
    isText(item.id) &&
    isText(item.title) &&
    isDate(item.createdAt) &&
    pillars.some(pillar => pillar.id === item.pillar)
  )
}

function isInboxItem(item: Raw) {
  return isText(item.id) && isText(item.text) && isDate(item.createdAt)
}

function isHabit(item: Raw) {
  return isText(item.id) && isText(item.name) && (item.doneOn === null || isText(item.doneOn))
}

export function parseSystemM(raw: string | null): SystemM {
  if (!raw) return emptySystemM

  try {
    const data: unknown = JSON.parse(raw)

    if (!isRaw(data) || data.version !== 2) return emptySystemM

    const items = list<Item>(data.items, isItem)

    return {
      version: 2,
      userName: isText(data.userName) ? data.userName : '',
      cycleMinutes: isCycleMinutes(data.cycleMinutes) ? data.cycleMinutes : defaultCycleMinutes,
      items,
      focusId: items.some(item => item.id === data.focusId) ? (data.focusId as string) : null,
      inbox: list<InboxItem>(data.inbox, isInboxItem),
      habits: list<Habit>(data.habits, isHabit)
    }
  } catch {
    return emptySystemM
  }
}
