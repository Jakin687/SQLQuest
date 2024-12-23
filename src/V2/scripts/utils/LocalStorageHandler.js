class LocalStorageHandler {
    constructor () {}

    static exists(name)
    {
        return localStorage.getItem(name) !== null;
    }

    static set(name, value)
    {
        return localStorage.setItem(name, value);
    }

    static get(name)
    {
        return localStorage.getItem(name);
    }

    static setJson(name, value)
    {
        return LocalStorageHandler.set(name, JSON.stringify(value));
    }

    static getJson(name)
    {
        return JSON.parse(LocalStorageHandler.get(name));
    }
}