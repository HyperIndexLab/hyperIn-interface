import { useCallback, useEffect } from 'react'
import {  useSelector } from 'react-redux'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import {  AppState } from '../index'

export default function Updater(): null {
  // const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)

  const fetchList = useFetchListCallback()

  const fetchAllListsCallback = useCallback(() => {
    Object.keys(lists).forEach(url =>
      fetchList(url).catch(error => console.debug('interval list fetching error', error))
    )
  }, [fetchList, lists])

  useEffect(() => {
    fetchAllListsCallback()
  }, [fetchAllListsCallback])

  return null
}