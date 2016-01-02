//
//  get xbox angle between two vectors
//  need to inverse Y and X axis on atan2
//
export function getAngle(x, y) {
    return (Math.atan2(y, x) * (180 / Math.PI));
}


//
//  get circle quadrant
//
export function getQuadrant(x, y) {
    // get coords signs
    const signX = Math.sign(x);
    const signY = Math.sign(y);

    // IM CREATING A MONSTER FFS!
    let quadrant;

    // 1st quadrant
    if (
        ((signX === 1) && (signY === -1)) ||
        ((x === 0) && (signY === -1))
    ) {
        quadrant = 1;
    } else
    // 2nd quadrant
    if (
        ((signX === -1) && (signY === -1)) ||
        ((signX === -1) && (y === 0))
    ) {
        quadrant = 2;
    } else
    // 3rd quadrant
    if (
        ((signX === -1) && (signY === 1)) ||
        ((x === 0) && (signY === -1))
    ) {
        quadrant = 3;
    } else
    // 4th quadrant
    if (
        ((signX === 1) && (signY === 1)) ||
        ((signX === 1) && (y === 0))
    ) {
        quadrant = 4;
    }

    return quadrant;
}
