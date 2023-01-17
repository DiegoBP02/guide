#### Time Conversion

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
