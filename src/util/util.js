export const mapObject = (o, mapFunc) => Object.keys(o).map(key => mapFunc(o[key], key))
