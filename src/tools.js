export function arrayEqual(arr1, arr2) {
    let isEqual = true;
    if (arr1.length === arr2.length) {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                isEqual = false;
                break;
            }
        }
    } else {
        isEqual = false;
    }

    return isEqual;

}