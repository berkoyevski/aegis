import { create } from 'zustand'

type UiState = {
  bootCounter: number
  incrementBoot: () => void
}

export const useUiStore = create<UiState>((set) => ({
  bootCounter: 0,
  incrementBoot: () => set((state) => ({ bootCounter: state.bootCounter + 1 })),
}))
