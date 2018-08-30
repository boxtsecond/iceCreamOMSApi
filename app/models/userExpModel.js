/**
 * Created by Bo on 2017/12/6.
 */

'use strict';

const eutil = require("eutil");

function UserExp(exp) {
  this.sid = exp.sid || 1;
  this.uid = exp.uid;
  this.exp = exp.exp || 0.00;
  this.note = exp.note || '';
  this.ctime = exp.ctime || eutil.getTimeSeconds();
  this.mtime = exp.mtime || eutil.getTimeSeconds();
}

module.exports = {
  UserExp
};
