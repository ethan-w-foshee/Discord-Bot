export function stupidify(message) {
    return replLetters(message, "g-l")
}

function replLetters(message, letters) {
    const reg = new RegExp(`[${letters}]`, "gi")
    return message.replace(reg, '')
}
