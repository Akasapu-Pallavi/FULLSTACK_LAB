let marks=[45,43,33,12,90];
console.log("Student marks:",marks)

let highest = marks[0];
for (let i=1;i<marks.length;i++){
    if (marks[i]>highest){
        highest=marks[i];
    }
}
console.log("highest marks:",highest);

let lowest=marks[0];
for(let i=1;i<marks.length;i++){
    if (marks[i]<lowest){
        lowest=marks[i];
    }
}
console.log("lowest marks:",lowest);