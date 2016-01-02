//
//  convert coords to BB8 sphere angle system
//
export function getBBAngle(x, y) {
    return (Math.abs(Math.atan2(x, y) * (180 / Math.PI) - 180));
}
