import equals from 'ramda/es/equals'

const OBJECT = 'object'
const ARRAY = 'array'

const getType = raw =>
  raw instanceof Array ? ARRAY : typeof raw === OBJECT ? OBJECT : typeof raw

export const isEquals = (from, to, dataKey) => {
  const key = dataKey || 'position'

  if (
    (getType(from) !== ARRAY && getType(to) !== OBJECT) ||
    (getType(from) !== OBJECT && getType(to) !== ARRAY)
  ) {
    return false
  }

  if (getType(from) === OBJECT && getType(to) === OBJECT) {
    return equals(from.props[key], to.props[key])
  }

  if (from.length !== to.length) {
    return false
  }

  for (let i = 0; i < from.length; i++) {
    if (!equals(from[i].props[key], to[i].props[key])) {
      return false
    }
  }

  return true
}
