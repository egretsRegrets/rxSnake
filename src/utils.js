export function nextDirection(previous, next) {
    let isOpposite = (previous, next) => {
        return next.x === previous.x * -1 || next.y === previous.y * -1;
    };

    if (isOpposite(previous, next)){
        return previous;
    }

    return next;
}