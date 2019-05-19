Set = class Set {
    constructor() {
        this.values = {}
    }

    add(val) {
        this.values[JSON.stringify(val)] = true
    }
}

Array.from = (container) => {
    if (container instanceof Set) {
        return Object.keys(container.values).map(val => JSON.parse(val))
    }
    throw new Error('failed Array.from')
}

Map = class Map {
    constructor() {
        this._keys = []
        this._values = []
    }

    keys() {
        return this._keys
    }

    values() {
        return this._values
    }

    get(key) {
        return this._values[this._keys.indexOf(JSON.stringify(key))]
    }

    set(key, value) {
        const k = JSON.stringify(k)
        const current = this._keys.indexOf(k)
        if (current > -1) {
            this._values[current] = value
        }
        this._keys.push(k)
        this._values.push(value)
        return
    }
}