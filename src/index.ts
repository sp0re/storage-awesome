
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
export interface getFunc {
    (search: (key: string, value: any) => boolean): { [key: string]: any }
}
////
export interface setFunc {
    (
        obj: { [key: string]: any },
        minute?: number
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

const ENDTIME:string = '-_-endtime-_-'

const storageFactory: factoryFunc = (storageObj: Storage = window.sessionStorage, globalName: string = "storageAwesome") => {
    let getData:any = (name:string = globalName) => {
        return JSON.parse(storageObj.getItem(name))
    }
    let setData:any = (data:any, name:string = globalName) => {
        storageObj.setItem(name, JSON.stringify(data))
    }
    let validateTime:any = (key: string) => {  
        let timeData = getData(globalName + ENDTIME)
        let flag = true
        if(timeData[key] && (new Date()).getTime() > timeData[key]) {
            flag = false
            O.delete(key)
            delete timeData[key]
            setData(timeData, globalName + ENDTIME)
        }
        return flag
    }
    let deleteTime:any = (key: string) => {
        setTimeout(()=>{
            let timeData = getData(globalName + ENDTIME)
            delete timeData[key]
            setData(timeData, globalName + ENDTIME)
        }, 0)         
    }
    let init:any = () => {
        !storageObj.getItem(globalName) && setData({})
        !storageObj.getItem(globalName + ENDTIME) && setData({}, globalName + ENDTIME)
    }
    let O: factoryReturn = {
        storageObj: storageObj,
        globalName: globalName,

        has: (arg: string | string[]) => {
            let data = getData();
            let flag = false;
            if(typeof arg === 'string') {                
                if(data[arg] && validateTime(arg)) {
                    flag = true
                }                
            }
            if(Array.isArray(arg)) {
                flag = true
                for(let i=0, len=arg.length; i<len; i++) {
                    let n = arg[i];
                    if(!validateTime(n)){
                        flag = false
                        break
                    }
                    if(!data[n]){
                        flag = false
                        break
                    }
                }
            }
            return flag
        },

        get: (arg: string | string[] | void | ((key: string, value: any) => boolean)) => {
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
            if(typeof arg === 'function') {
                let result: { [key: string]: any } = {}
                for(let key in data) {
                    if(arg(key, data[key])) {
                        result[key] = data[key]
                    }
                }
                return result      
            }
        },

        set: (obj: { [key: string]: any }, minute?: number ) => {
            let data = {
                ...getData(),
                ...obj
            }
            setData(data)
            if(minute) {
                setTimeout(()=>{
                    let endTime: number = (new Date()).getTime() + minute * 60 * 1000
                    let result: { [key: string]: number } = {}
                    for(let key in obj) {
                        result[key] = endTime
                    }
                    setData(result, globalName + ENDTIME)    
                }, 0)                        
            }
            return O
        },

        delete: (arg: string | string[]) => {
            let data = getData();
            if(typeof arg === 'string') {   
                delete data[arg]
                deleteTime(arg)
            }
            if(Array.isArray(arg)) {
                for(let i=0, len=arg.length; i<len; i++) {
                    let n = arg[i];
                    delete data[n]
                    deleteTime(n)  
                }
            }
            setData(data)
            return O
        },

        clear: (arg: void) => {
            setData({})
            setTimeout(()=>{
                setData({}, globalName + ENDTIME)
            }, 0)
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