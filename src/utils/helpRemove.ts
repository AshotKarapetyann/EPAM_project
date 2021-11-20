async function helpRemove (obj:any) {
    const code = await obj?.error?.code;
    delete obj?.error?.code;
    return {
        code:code,
        result:obj
    }
};
export default helpRemove;