/**
 * Created by Bo on 2017/11/10.
 */

function convertStr2Date(str) {
  let year = str.substr(0, 4);
  let month = str.substr(4, 2);
  let day = str.substr(6, 2);
  let hour = str.substr(8, 2);
  let min = str.substr(10, 2);
  let sec = str.substr(12, 2);
  return new Date(year, month, day, hour, min, sec);
}

module.exports = {
  convertStr2Date
};
