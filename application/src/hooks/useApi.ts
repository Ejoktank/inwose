import useSWR from "swr";
import { QueryFunction } from "../lib/fetcher/core/exec";

export function useApi<D, K>(func:QueryFunction<D, K>, x:D) {
    return useSWR(x === null ? null : [func.url, x], func.swrFn);
}
