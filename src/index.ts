
export interface factoryReturn {
    storageObj: Storage,
    globalName: string,
    has: hasFunc,
    get: getFunc,
    set: setFunc,
    delete: deleteFunc,
    clear: clearFunc,
}
////
export type hasFunc = hasFunc1 | hasFunc2

export interface hasFunc1 {
    (key: string): boolean
}
export interface hasFunc2 {
    (keys: [key: string]): { [key: string]: boolean }
}
////
export type getFunc = getFunc1 | getFunc2 | getFunc3

export interface getFunc1 {
    (key: string): any
}
export interface getFunc2 {
    (keys: [key: string]): { [key: string]: any }
}
export interface getFunc3 {
    (key: null): { [key: string]: any }
}
////
export interface setFunc {
    (
        obj: { [key: string]: any },
        time?: number
    ) : factoryReturn
}
////
export type deleteFunc = deleteFunc1 | deleteFunc2

export interface deleteFunc1 {
    (key: string): factoryReturn
}
export interface deleteFunc2 {
    (keys: [key: string]): factoryReturn
}
////
export interface clearFunc {
    (key: null): factoryReturn
}

////
export interface factoryFunc {
    (storageObj: Storage, globalName?: string): factoryReturn
}

const storageFactory: factoryFunc = (storageObj: Storage = window.sessionStorage, globalName: string = "storageAwesome") => {
    let getData:any = () => {
        return JSON.parse(storageObj.getItem(globalName))
    }
    let setData:any = (data:any) => {
        storageObj.setItem(globalName, JSON.stringify(data))
    }
    let init:any = () => {
        !storageObj.getItem(globalName) && setData({})
    }
    let O: factoryReturn = {
        storageObj: storageObj,
        globalName: globalName,

        has: (arg: string | [key: string]) => {
            return true
        },

        get: (arg: string | [key: string] | null) => {
            
        },

        set: (obj: { [key: string]: any }, time?: number ) => {
            return O
        },

        delete: (arg: string | [key: string]) => {
            return O

        },

        clear: (arg: null) => {
            return O
        }
    }

    init()
    return O
}

export default storageFactory
// export {storageFactory}