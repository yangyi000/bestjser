
const TEST = (state='', action) => {
    switch (action.type) {
        case 'TEST':
            return action.show
        default:
            return state
    }
}

export default TEST
    