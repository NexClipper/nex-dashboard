const BODY = 'body'

export const addClass = (element: Element | null, className: string) =>
  element ? element.classList.add(className) : null
export const removeClass = (element: Element | null, className: string) =>
  element ? element.classList.remove(className) : null
export const hasClass = (element: Element | null, className: string) =>
  element ? element.classList.contains(className) : null
export const getElement = (selector: string) => document.querySelector(selector)
export const getBody = () => getElement(BODY)
export const addClassToBody = (className: string) =>
  addClass(getBody(), className)
export const removeClassToBody = (className: string) =>
  removeClass(getBody(), className)
export const hasClassOfBody = (className: string) =>
  hasClass(getBody(), className)
