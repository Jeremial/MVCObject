export declare class MVCObject {
  get<T = any>(key: string): T;
  set<T = any>(key: string, value?: T): MVCObject;
  changed(...args: any[]): any;
  notify(key: string): MVCObject;
  setValues(values: { [x: string]: any }): MVCObject;
  bindTo(key: string, target: MVCObject, targetKey?: string, noNotify?: boolean): MVCObject;
  unbind(key: string): MVCObject;
  unbindAll(): MVCObject;
}

export default MVCObject;
