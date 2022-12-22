export function debounce(func: CallableFunction, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

export function isEmail(string: string) {
  return string.match(/^\S+@\S+\.\S+$/) != null
}
