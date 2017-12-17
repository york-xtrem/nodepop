"use strict";

function filterRangeNumber(range) {
  let _range = range;
  let groupRange = [];
  // REGEX INFO:
  // (\d*[.]?\d*) -> Number x.x
  // (-?) -> dash
  const regex = /^(\d*[.]?\d*)?(-?)?(\d*[.]?\d*)?$/g;
  let m;
  let filter;

  while ((m = regex.exec(_range)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // console.log("M: " + m);
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      // console.log(`Found match, group ${groupIndex}: ${match}`);
      groupRange.push(match);
    });
  }

  if (groupRange[1] && !groupRange[2] && !groupRange[3]) {
    filter = _range;
  } else {
    filter = {
      $gte: parseFloat(groupRange[1]) || 0,
      $lte: parseFloat(groupRange[3]) || Number.MAX_SAFE_INTEGER
    };
  }

  return filter;
}

module.exports = filterRangeNumber;
