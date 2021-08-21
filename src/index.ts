
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
export interface hasFunc {
    (key: string): boolean
}
export interface hasFunc {
    (keys: string[]): boolean
}
////
export interface getFunc {
    (key: string): any
}
export interface getFunc {
    (keys: string[]): { [key: string]: any }
}
export interface getFunc {
    (key: void): { [key: string]: any }
}
////
export interface setFunc {
    (
        obj: { [key: string]: any },
        time?: number
    ) : factoryReturn
}
////
export interface deleteFunc {
    (key: string): factoryReturn
}
export interface deleteFunc {
    (keys: string[]): factoryReturn
}
////
export interface clearFunc {
    (key: void): factoryReturn
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

        has: (arg: string | string[]) => {
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

        get: (arg: string | string[] | void) => {
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

        delete: (arg: string | string[]) => {
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

        clear: (arg: void) => {
            setData({})
            return O
        }
    }

    init()
    return O
}

export default storageFactory

const SessionStorage:factoryReturn = storageFactory(window.sessionStorage)
const LocalStorage:factoryReturn = storageFactory(window.localStorage)
const SS:factoryReturn = SessionStorage
const LS:factoryReturn = LocalStorage

export { SessionStorage, LocalStorage, SS, LS }