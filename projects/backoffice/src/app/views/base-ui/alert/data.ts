export type AlertType = {
  message: string
  type: string
}

export const alert: AlertType[] = [
  {
    type: 'primary',
    message: 'A simple primary alert—check it out!',
  },
  {
    type: 'secondary',
    message: 'A simple secondary alert—check it out!',
  },
  {
    type: 'success',
    message: 'A simple success alert—check it out!',
  },
  {
    type: 'danger',
    message: 'A simple danger alert—check it out!',
  },
  {
    type: 'warning',
    message: 'A simple warning alert—check it out!',
  },
  {
    type: 'info',
    message: 'A simple info alert—check it out!',
  },
  {
    type: 'light',
    message: 'A simple light alert—check it out!',
  },
  {
    type: 'dark',
    message: 'A simple dark alert—check it out!',
  },
]
