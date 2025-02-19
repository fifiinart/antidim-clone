export function format(number: number, defaultToFixed = 1, postEToFixed = 2) {
  if (number === Infinity) return "Infinite"
  if (number < 1000) {
    return number.toFixed(defaultToFixed);
  } else {
    const exp = Math.floor(Math.log10(number))
    return `${(number / 10 ** exp).toFixed(postEToFixed)}e${exp}`
  }
}

export function predicateClass(element: HTMLElement, className: string, condition: boolean) {
  if (condition) element.classList.add(className);
  else element.classList.remove(className)
}

export function conditionalShow(element: HTMLElement, condition: boolean) {
  element.style.display = condition ? "" : "none";
}