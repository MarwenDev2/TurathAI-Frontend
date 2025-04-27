import { createAction, props } from '@ngrx/store'

export const changetheme = createAction(
  '[Layout] Set Color',
  props<{ color: string }>()
)
export const changetopbarcolor = createAction(
  '[Layout] Set Topbar',
  props<{ topbar: string }>()
)
export const changemenucolor = createAction(
  '[Layout] Set Menu',
  props<{ menu: string }>()
)
export const changesidebarsize = createAction(
  '[Layout] Set size',
  props<{ size: string }>()
)
export const resetState = createAction('[App] Reset State')
