#### a very big sum
- declare a variable
- create a loop that checks the typeof each item in the array, if it is equal to a number, then add the current position of the array to the variable
- return the sum

#### diagonal difference
- variable for each one of the diagonals
- loop through rows and columns
- i = j
- i + j = arr.length - 1
- return math abs

#### plus minus
- variable for positive, negative, zero
- do a forEach loop in the array, then sort them and add 1 to right counter
- log using toFixed and "\n"

#### staircase
- create a loop i
- empty variable
- create a loop j
- j < (n-1-i) then add a space, otherwise add a #
- log for each row run

0,0 0,1 0,2 0,3
1,0 1,1 1,1 1,3
2,0 2,1 2,2 2,3
3,0 3,1 3,2 3,3

#### mini max sum
- declare max and min variable equal to arr[0]
- declare sum and length
- create a for loop to get the max and min number of the array
- no number can be bigger than the number of max
- min must be equal to the smaller number of the array
- after each run, sum the current position of the array to sum
- declare maxSum and minSum with the minus math
- log minSum and maxSum

#### birthday cake candles
- declare max and counter
- do a forEach loop
- check if item is bigger than max, if it is, set max equal to item and set the counter to 1
- else if max is equal to item, then add one to counter
- return counter

#### time coversion
// find if AM or PM
// if AM are 12 set it to 00
// if PM are more than 12 add 12 to it
// ignore the AM PM and return
// 07:05:45PM

- create let lastTwo equal to substring(8) of s
  // ignoring AM PM
- create let fullTime equal to substring(0, 8) of s
  // array for test
- create let times equal to fullTime and split in ":"
- set if else condition
- if
  // PM case
  lastTwo is equal to PM, then if position [0] of times is different than 12, then position [0] of times is equal to parseInt(times[0]) plus 12
- else
  // AM case
- if position [0] of times is equal to 12, then position [0] of times is equal to 00
- return times.join(":")
