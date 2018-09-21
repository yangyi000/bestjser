const Actions = {
    TEST:'TEST',
    LOGIN:'LOGIN'
}
let nextid=0;

export const LOGINACTION = (text)=>{
    return {
        type: Actions.LOGIN,
        text:text,
        id:nextid++
    }
}
export const TESTACTION = (show)=>{
    return {
        type:Actions.TEST,
        show
    }
}