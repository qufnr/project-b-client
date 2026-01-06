/**
 * x초 동안 잠자기
 *
 * @param sec 잠자는 시간 (초 단위)
 */
const sleep = async (sec: number) =>
    await new Promise(resolve => setTimeout(resolve, sec * 1000))

export const TimeUtils = {
    sleep
}
