
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
    (keys: [key: string]): boolean
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
    (storageObj?: Storage, globalName?: string): factoryReturn
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
            let data = getData();
            let flag = false;
            if(typeof arg === 'string') {                
                if(data[arg]) {
                    flag = true
                }                
            }
            if(Array.isArray(arg)) {
                flag = true
                for(let i=0, len=arg.length; i<len; i++) {
                    let n = arg[i];
                    if(!data[n]){
                        flag = false
                        break
                    }
                }
            }
            return flag
        },

        get: (arg: string | [key: string] | null) => {
            let data = getData();
            if(!arg) {
                return data
            }
            if(typeof arg === 'string') {
                return data[arg]        
            }
            if(Array.isArray(arg)) {
                let result: { [key: string]: any } = {}
                for(let i=0, len=arg.length; i<len; i++) {
                    let n = arg[i];
                    result[n] = data[n]
                }
                return result
            }
        },

        set: (obj: { [key: string]: any }, time?: number ) => {
            let data = {
                ...getData(),
                ...obj
            }
            setData(data)
            return O
        },

        delete: (arg: string | [key: string]) => {
            let data = getData();
            if(typeof arg === 'string') {   
                delete data[arg]            
            }
            if(Array.isArray(arg)) {
                for(let i=0, len=arg.length; i<len; i++) {
                    let n = arg[i];
                    delete data[n]  
                }
            }
            setData(data)
            return O
        },

        clear: (arg: null) => {
            setData({})
            return O
        }
    }

    init()
    return O
}

export default storageFactory

const sessionStorage:factoryReturn = storageFactory(window.sessionStorage)
const localStorage:factoryReturn = storageFactory(window.localStorage)

export { sessionStorage, localStorage }