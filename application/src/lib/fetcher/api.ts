import { z } from "zod";
import { utils, create } from "./core/exec";

const loginModel = z.object({
    refresh: z.string(),
    access : z.string()
});
const tokenErrorModel = z.object({
    ok: z.boolean(),
    wrongAccessToken: z.boolean(),
})

const fetcher = create({ 
    baseUrl: '/v0/api',
    getCredentials: () => {
        const token = localStorage.getItem('accessToken')
        if (!token || token === '') {
            return undefined
        }
        return token;
    },
    hook: ({ data, status, ask, repeat }) => {
        if (status === 401) {
            const token = localStorage.getItem('accessToken')
            if (!token || token === '') {
                return undefined
            }
            const refresh = localStorage.getItem('refreshToken')
            if (!refresh) {
                return undefined
            }
            const parseResult = tokenErrorModel.safeParse(data)
            if (!parseResult.success) {
                return undefined
            }
            if (!parseResult.data.ok && parseResult.data.wrongAccessToken) {
                return ask('POST', '/refresh', {
                    body: { token: refresh }
                })
                    .then(x => loginModel.safeParseAsync(x.data))
                    .then(res => {
                        if (!res.success) {
                            return Promise.reject(res.error)
                        }
                        localStorage.setItem('accessToken', res.data.access)
                        localStorage.setItem('refreshToken', res.data.refresh)
                        return Promise.resolve()
                    })
                    .then(repeat)
            }
        }
        return undefined
    }
})

////////////////////////////////////////////////
// MODELS

interface LoginParam {
    username: string
    password: string
}

export const taskType = z.union([
    z.literal('personal'),
    z.literal('pari'),
    z.literal('team'),
])
export const taskCategory = z.union([
    z.literal('qualification'),
    z.literal('outlook'),
])
export const taskStatus = z.union([
    z.literal('completed'),
    z.literal('upcoming'),
])
export const sizeType = z.union([
    z.literal('sm'),
    z.literal('md'),
    z.literal('lg'),
])
export const coinColors = z.union([
    z.literal('green'),
    z.literal('red'),
])
export const taskModel = z.object({
    id: z.number(),
    sizeName: sizeType,
    taskType: taskType,
    categoryName: taskCategory,
    taskName: z.string(),
    taskDescr: z.string().nullable(),
    taskStatus: taskStatus,
    createdAt: z.number(),
    changetAt: z.number().nullable(),
    deletedAt: z.number().nullable(),
    expiredAt: z.number().nullable(),
    deadline: z.number().nullable(),
    deadlineTime: z.string().nullable(),
    deadlineTimeMS: z.number().nullable(),
    dateOfComplete: z.number().nullable(),
    timeForComplete: z.number().nullable(),
    coinsHasPlus: z.boolean().nullable(),
    coinsHasBg: z.boolean().nullable(),
    coinsAmount: z.number().nullable(),
    coinsNotEarnedAmount: z.number().nullable(),
    coinColor: coinColors.nullable(),
    userId: z.number().nullable(),
})
export const taskArray = taskModel.array()
export const taskCreateModel = taskModel.omit({ id: true, userId: true })
export const taskUpdateModel = taskCreateModel.partial()

export type TaskCreateModelType = z.infer<typeof taskCreateModel>
export type TaskUpdateModelType = z.infer<typeof taskUpdateModel>

////////////////////////////////////////////////
// API

export const api = {
    user: {
        login:  fetcher.query("[POST] /login", loginModel, utils.asBody<LoginParam>),
        me:     fetcher.query("[GET]  /protected", z.any()),
        logout: fetcher.touch("[POST] /logout"),
    },
    tasks: {
        list: fetcher.query("[GET] /tasks/list", taskArray),
        create: fetcher.touch("[POST] /tasks/create", utils.asBody<TaskCreateModelType>),
        update: fetcher.touch("[PATCH] /tasks/update", 
            ({ id, ...body }:TaskUpdateModelType & { id: number }) => ({
                query: { id },
                body
            })
        )
    }
}
