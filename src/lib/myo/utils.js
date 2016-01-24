//
//  Angles quanternion helpers
//
export function roll(q) {
    return Math.atan2(2.0 * (q.y * q.z + q.w * q.x), q.w * q.w - q.x * q.x - q.y * q.y + q.z * q.z);
}

export function pitch(q) {
    return Math.asin(-2.0 * (q.x * q.z - q.w * q.y));
}

export function yaw(q) {
    return Math.atan2(2.0 * (q.x * q.y + q.w * q.z), q.w * q.w + q.x * q.x - q.y * q.y - q.z * q.z);
}
