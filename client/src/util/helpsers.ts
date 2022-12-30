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

export function makeRandomColor() {
  let c = ''
  while (c.length < 7) {
    c += Math.random().toString(16).substr(-6).substr(-1)
  }
  return '#' + c
}
