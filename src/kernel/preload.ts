// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import type { AccountDataRecord } from '../types/accounts'

import { contextBridge, ipcRenderer } from 'electron'

import { electronAPIEventKeys } from '../config/constants/main-process'

export const availableElectronAPIs = {
  /**
   * Methods
   */

  openExternalURL: (url: string) => {
    ipcRenderer.send(electronAPIEventKeys.openExternalURL, url)
  },

  requestAccounts: () => {
    ipcRenderer.send(electronAPIEventKeys.requestAccounts)
  },

  /**
   * Events
   */

  onAccountsLoaded: (
    callback: (values: AccountDataRecord) => Promise<void>
  ) => {
    ipcRenderer.on(electronAPIEventKeys.onAccountsLoaded, (_, values) => {
      callback(values).catch(() => {})
    })
  },

  onRemoveAccount: (accountId: string) => {
    if (typeof accountId !== 'string') {
      return
    }

    ipcRenderer.send(electronAPIEventKeys.onRemoveAccount, accountId)
  },
} as const

contextBridge.exposeInMainWorld('electronAPI', availableElectronAPIs)
