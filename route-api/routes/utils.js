function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}
function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)], //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}
exports.quickSort = function(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            exports.quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            exports.quickSort(items, index, right);
        }
    }
    return items;
}

exports.JSONtoArray = function(JSON){
    arr = []
    for(let i=0; i<=Object.keys(JSON).length-1; i++){
        arr[i] = JSON[`${i}`]
    }
    return arr
}

exports.ArraytoJSON = function(arr){
    cJSON = {}
    for(let i=0; i<=arr.length-1; i++){
        cJSON[`${i}`] = arr[i]
    }
    return cJSON
}
