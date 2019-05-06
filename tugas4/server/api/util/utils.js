export const parseError = err => {
    if (typeof err === 'string')
        return err

    if ('errors' in err)
        return err.errors.map(e => e.message)
    
    if ('parent' in err && err.parent.detail !== undefined)
        return err.parent.detail

    if ('parent' in err && err.parent.routine !== undefined)
        return err.parent.routine
}


export const assertNotNull = result => {
    if (result === null)
        throw "Not found"
    return result
}
