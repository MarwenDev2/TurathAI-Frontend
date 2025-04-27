import type { MenuItem } from '../common/menu-meta'

export const findAllParent = (menuItems: MenuItem[], menuItem: any): any => {
  let parents = []
  const parent = findMenuItem(menuItems, menuItem['parentKey'])

  if (parent) {
    parents.push(parent['key'])
    if (parent['parentKey'])
      parents = [...parents, ...findAllParent(menuItems, parent)]
  }
  return parents
}

export const findMenuItem = (
  menuItems: MenuItem[],
  menuItemKey: string
): any => {
  if (menuItems && menuItemKey) {
    for (var i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) {
        return menuItems[i]
      }
      var found = findMenuItem(menuItems[i].subMenu, menuItemKey)
      if (found) return found
    }
  }
  return null
}

export function addOrSubtractDaysFromDate(days: number): Date {
  const result = new Date()
  result.setDate(result.getDate() + days)
  return result
}

const eventDate = new Date('Jan 17, 2026 12:00:01')

export const calculateTimeToEvent = () => {
  const currentDate = new Date()

  const timeRemaining = eventDate.getTime() - currentDate.getTime()

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

