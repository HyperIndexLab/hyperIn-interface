import { createReducer } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists/dist/types'
import { fetchTokenList, selectList } from './actions'

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null
      readonly loadingRequestId: string | null
      readonly error: string | null
    }
  }
  readonly selectedListUrl: string | undefined
}

const initialState: ListsState = {
  byUrl: {},
  selectedListUrl: "https://explorer.hsk.xyz/api/v2/tokens"
}

export default createReducer(initialState, builder =>
  builder
    .addCase(fetchTokenList.pending, (state, { payload: { requestId, url } }) => {
      state.byUrl[url] = {
        ...state.byUrl[url],
        loadingRequestId: requestId,
        error: null,
        current: null
      }
    })
    .addCase(fetchTokenList.fulfilled, (state, { payload: { requestId, tokenList, url } }) => {
      state.byUrl[url] = {
        ...state.byUrl[url],
        loadingRequestId: null,
        error: null,
        current: tokenList
      }
    })
    .addCase(fetchTokenList.rejected, (state, { payload: { url, requestId, errorMessage } }) => {
      if (state.byUrl[url]?.loadingRequestId !== requestId) {
        return
      }

      state.byUrl[url] = {
        ...state.byUrl[url],
        loadingRequestId: null,
        error: errorMessage,
        current: null
      }
    })
    .addCase(selectList, (state, { payload: url }) => {
      state.selectedListUrl = url
    })
)