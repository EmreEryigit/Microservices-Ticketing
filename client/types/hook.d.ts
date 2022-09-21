declare interface Hook {
    url: string
    method: 'get' | 'post'
    body: any
    onSuccess: any
}