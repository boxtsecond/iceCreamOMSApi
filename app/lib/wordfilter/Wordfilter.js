'use strict';
class Wordfilter {
  constructor(){
    this.blacklist = require('./badwords.json');
    this.regex = new RegExp(this.blacklist.join('|'), 'i');
  }
  rebuild(){
    this.regex = new RegExp(this.blacklist.join('|'), 'i');
  }
  blacklisted(string){
    return !!this.blacklist.length && this.regex.test(string);
  }
  addWordsList(array){
    if (!array || !array.length) return;
    this.blacklist = this.blacklist.concat(array);
    this.rebuild();
  }
  addWords(string){
    if(!this.blacklisted(string)) this.blacklist.push(string);
    this.rebuild();
  }
  removeWord(word){
    var index = this.blacklist.indexOf(word);
    if (index > -1) {
      this.blacklist.splice(index, 1);
      this.rebuild();
    }
  }
  clearList() {
  this.blacklist = [];
  this.rebuild();
  }
}
module.exports=Wordfilter;
