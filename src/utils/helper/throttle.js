export function throttle(fn, delay) {
    let start, now, timer;

    if(!start){
        start = Date.now();
    }

    return function () {
        now = Date.now();

        if (now - start > delay) {
            fn();
            start = Date.now();
        } else {
            !!timer && clearTimeout(timer)
            timer = setTimeout(() => {
                fn();
            }, delay / 2)
        }
    }
}
