
/////////////////////////////////////////////////////////////////////
/* EXEC LAYER */

import { z, ZodType } from "zod";

type Method = 
      'GET'   
    | 'POST'
    | 'PUT'
    | 'UPDATE'
    | 'DELETE'
    | 'PATCH'

interface FetcherOpenConfig {
    baseUrl: string,
    getCredentials: () => string | undefined;
}

type ExecConfigType = string | FetcherOpenConfig

function resolveConfig(input:ExecConfigType): FetcherOpenConfig {
    if (typeof input === 'string') {
        return { baseUrl: input, getCredentials: () => undefined }
    }
    return input;
}

export function createExec(config:ExecConfigType) {
    const settings = resolveConfig(config);
    return (method:Method, url:string, body:unknown = undefined) => {
        const token = settings.getCredentials();
        return fetch(
            normalizeUrl(`${settings.baseUrl}/${url}`), 
            {
                headers: Object.assign({
                    'Content-Type': 'application/json'
                }, over(token, (x) => ({
                    'Authorization': `Bearer ${x}`
                }))),
                method,
                body: over(body, JSON.stringify)
            }
        );
    }
}

/////////////////////////////////////////////////////////////////////
/* REQUEST LAYER */

type RequestConfigType = ExecConfigType;

function parseUrl(url:string) {
    let buffer = '';

    const params: [boolean, string][] = [];
    let mode = 0;

    for (const letter of url) {
        switch (mode) {
            case 0: {
                if (letter === ':') {
                    params.push([false, buffer])
                    buffer = "";
                    mode = 1;
                } else {
                    buffer += letter;
                }
                break;
            }
            case 1: {
                if (letter === '/') {
                    mode = 0;
                    params.push([true, buffer]);
                    buffer = "/";
                } else if (letter === ':') {
                    params.push([true, buffer]);
                    buffer = "";
                } else {
                    buffer += letter;
                }                
                break;
            }
        }
    }

    if (mode == 0) {
        params.push([false, buffer]);
    }
    if (mode == 1) {
        params.push([true, buffer]);
    }

    return params;
}

interface Printable {
    toString: () => string
}

type ParamsDict = Record<string, Printable | undefined>
type QueryDict = Record<string, Printable | undefined>

interface RequestContent {
    params?: ParamsDict,
    query?: QueryDict,
    body?: unknown
}

export function createRequest(config:RequestConfigType) {
    const exec = createExec(config);
    
    function req(method:Method, url:string, content?:RequestContent) {
        
        const [ base, path ] = detachBase(url);
        const chunkedPath = parseUrl(path);

        const truePath = chunkedPath.map(([param, text]) => {
            if (param) {
                const value = content?.params?.[text];
                if (value === undefined) {
                    console.warn(`WARNING! Parameter "${text}" not specified in "${url}"!!!`);
                    return ""
                }
                return value;
            }
            return text;
        }).join('')

        let query = '';
        if (content && content.query) {
            const params = new URLSearchParams();
            for (const key in content.query) {
                const value = content.query[key];
                if (value !== undefined) {
                    params.set(key, value.toString());
                }
            }
            query = '?' + params.toString();
        }
        
        return exec(method, base + truePath + query, content?.body);
    }

    return req;
}

/////////////////////////////////////////////////////////////////////
/* VALIDATION LAYER */

type ValidationConfigType = RequestConfigType

interface RequestParams {
    method:Method
    url:string
    content?:RequestContent
}

export function createValidation(config:ValidationConfigType) {
    const req = createRequest(config);

    const process = <M>(model:ZodType<M>, params:RequestParams) =>
        req(params.method, params.url, params.content)
            .then(parseIfJson)
            .then(model.safeParseAsync)
            .then(x => x.success ? x.data : Promise.reject(new BadContentError()))

    return process;
}

/////////////////////////////////////////////////////////////////////
/* INTERFACE LAYER */

type InterfaceConfigType = ValidationConfigType

export interface SWRBox<D, K> {
    url: string,
    fn: (x:[string, D]) => Promise<K>
}

export interface QueryFunction<D, K> {
    (x:D): Promise<K>
    url: string
    swrFn: (xs:[string, D]) => Promise<K>
}

export function createInterface(config:InterfaceConfigType) {
    const req = createValidation(config);

    const action = 
        (method:Method)                                            => 
        <M>(url:string, model:ZodType<M>, content?:RequestContent) => 
            req<M>(model, { url, method, content })

    return {
        get:    action('GET'),
        post:   action('POST'),
        put:    action('PUT'),
        update: action('UPDATE'),
        delete: action('DELETE'),
        patch:  action('PATCH'),

        query: <D, M>(url:string, model:ZodType<M>, prepare?:(x:D) => RequestContent) => {
            const [method, address] = retrieveMethod(url);
            const func: QueryFunction<D, M> = (x:D) => action(method)(address, model, prepare?.(x));
            func.url = url
            func.swrFn = ([,x]) => func(x)
            return func
        },
        touch: <D>(url:string, prepare?:(x:D) => RequestContent) => {
            const [method, address] = retrieveMethod(url);
            const func: QueryFunction<D, unknown> = (x:D) => action(method)(address, z.any(), prepare?.(x))
            func.url = url
            func.swrFn = ([,x]) => func(x)
            return func
        },
    }
}

/////////////////////////////////////////////////////////////////////

export const create = createInterface

/////////////////////////////////////////////////////////////////////
/* COOL EXPORT UTILS */

const asBody = <T>(body:T): RequestContent => ({ body })
const asQuery = <T extends QueryDict>(query:T): RequestContent => ({ query })
const asParams = <T extends ParamsDict>(body:T): RequestContent => ({ body })

const asIdParam = <T extends Printable>(x:T): RequestContent => ({ params: { id: x } });
const asIdQuery = <T extends Printable>(x:T): RequestContent => ({ query: { id: x } });

const paramIdAndBody = <T extends { id: Printable }>(data: T): RequestContent => {
    const { id, ...body } = data;
    return {
        params: { id },
        body
    }
}
const queryIdAndBody = <T extends { id: Printable }>(data: T): RequestContent => {
    const { id, ...body } = data;
    return {
        query: { id },
        body
    }
}

/* actually not working
type IntersectTuple<Ts extends unknown[]> = 
    Ts extends [infer K, ...infer Rest] ? K & IntersectTuple<Rest> : unknown;
type GetFirstArgument<Ts extends (...xs:unknown[]) => unknown> = 
    Ts extends (x:infer K, ...rest:unknown[]) => unknown ? K : unknown
type GetFirstArgumentFromTuple<Ts extends unknown[]> =
    Ts extends [infer K, ...infer Rest] ? 
        K extends (...xs:unknown[]) => unknown 
            ? [GetFirstArgument<K>, ...GetFirstArgumentFromTuple<Rest>]
            : []
        : []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const concat = <Ts extends any[]>(...funcs:Ts) => {
    return (x:IntersectTuple<GetFirstArgumentFromTuple<Ts>>): RequestContent => {
        let result: RequestContent = {};
        for (const f of funcs) {
            result = Object.assign(result, f(x));
        }
        return result;
    }
}
*/

export const utils = {
    asBody,
    asQuery,
    asParams,

    asIdParam,
    asIdQuery,

    paramIdAndBody,
    queryIdAndBody,
}



/////////////////////////////////////////////////////////////////////
// UTILS

class FetcherError extends Error {
    constructor(msg?:string) {
        super(msg);
    }
}

// class NotJsonContentError extends FetcherError { }
class BadContentError extends FetcherError { }

function parseIfJson(r:Response) {
    return r.json();
}

function detachBase(url:string): [string, string] {

    let head = "";
    let tail = url;

    const protocolSymIdx = tail.indexOf("://");

    if (protocolSymIdx < 0) {
        return [head, tail];
    }

    const splitProtocolIdx = protocolSymIdx + 3;
    head = tail.substring(0, splitProtocolIdx);
    tail = tail.substring(splitProtocolIdx);

    const pathBeginIdx = tail.indexOf('/');
    if (pathBeginIdx < 0) {
        return [head + tail, '']
    }

    head += tail.substring(0, pathBeginIdx);
    tail =  tail.substring(pathBeginIdx);

    return [head, tail];
}

function normalizeUrl(url:string) {
    let text = ""
    let escaped = false;
    let previous = false;
    for (const letter of url) {
        if (letter === ':') {
            text += letter;
            previous = false;
            escaped = true;
            continue;
        }
        if (letter === '/') {
            if (previous) {
                continue;
            }
            if (!escaped) {
                previous = true;
            }
        } else {
            previous = false;
        }

        text += letter;
        escaped = false;
    }

    return text;
}

function retrieveMethod(url:string): [Method, string] {
    const trimmed = url.trim();
    if (!trimmed.startsWith('[')) {
        throw new Error(`NOT VALID! FIX ROUTE: "${url}"`);
    }
    const idx = trimmed.indexOf(']');
    if (idx < 0) {
        throw new Error(`NOT VALID! FIX ROUTE: "${url}"`);
    }
    
    const method = trimmed.substring(1, idx).toUpperCase();
    const address = trimmed.substring(idx + 1).trim();
    
    const METHODS = [
        'GET',
        'POST',
        'PUT',
        'UPDATE',
        'DELETE',
        'PATCH'
    ];  

    if (!METHODS.includes(method)) {
        throw new Error(`NOT VALID! FIX ROUTE: "${url}"`);
    }

    return [ method as Method, address ]
}

/////////////////////////////////////////////////////////////////////
// HELPERS 

function over<K, T>(x:K | undefined, f:(x:K) => T | undefined, def?: T): T | undefined {
    if (x === undefined) {
        return def ?? undefined;
    }
    return f(x);
}
