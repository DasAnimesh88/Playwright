what is closure?

what is hoisting ?

hoisting in javascript -it a way in which the function declaration moves to the top of the code before it is executed

let /var/con /function -hoisitng

var - udefid
let /const -TDZ /Refrence error

comsole.log(function a())

function a(){

    console.log("Hello")
}

comsole.log(function a())



 type coercion -imolict conversion --  + this will conver the string to numberconsole.log("15"+"10")

 console.log("15"-"10")


 Two kinds of coercion
1. Implicit coercion — JS does it automatically
2. Explicit coercion — you do it deliberately (Number(), String(), Boolean())
Implicit coercion examples (the tricky interview part)
javascript// String coercion (+ with a string triggers string concat)
console.log(1 + '2')        // '12'  (number → string)
console.log('5' + 3)        // '53'
console.log(1 + 2 + '3')    // '33'  (1+2=3 first, then '3'+'3')
console.log('3' + 1 + 2)    // '312' (left to right, string wins early)

// Numeric coercion (-, *, / force numbers, even on strings)
console.log('5' - 2)        // 3
console.log('5' * '2')      // 10
console.log('10' / '2')     // 5
console.log('abc' - 1)      // NaN

// Boolean coercion (in conditionals, !!, if statements)
console.log(Boolean(''))    // false
console.log(Boolean('0'))   // true  ⚠️ non-empty string is truthy!
console.log(Boolean(0))     // false
console.log(Boolean([]))    // true  ⚠️ empty array is truthy
console.log(Boolean({}))    // true  ⚠️ empty object is truthy
== vs === (the classic gotcha)
== allows coercion, === does not.
javascriptconsole.log(1 == '1')       // true  (string coerced to number)
console.log(1 === '1')      // false (different types, no coercion)

console.log(null == undefined)   // true  (special case)
console.log(null === undefined)  // false

console.log(0 == false)     // true
console.log(0 === false)    // false

console.log('' == 0)        // true  ('' → 0)
console.log(NaN == NaN)     // false ⚠️ NaN is never equal to itself




== and === 

'5'==5 true loose compartor

'5'===5 false strcit compra


let arr =[1,2,3,4,5]

let str="hello"
console.log(typeOf str) string


console.log(typeOf arr) -object


for(let a of arr){

console.log(a)

}


reverse 

let s= "Hello"

let v1=s.split("").reverse().join("")
let v2=s.split("").reverse().join("")


