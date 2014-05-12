'use strict;'
var colors   = require('colors');
var ld = require("lodash")
var async = require('async')
var fs = require("fs")
var archiver = require("archiver")
var path = require("path")
var swig  = require('swig');



function ExportResults(settings) {
  this.settings = settings;

  ld.bindAll(this, ["generate", "getExportPath"])
}


ExportResults.prototype.generate = function (cb) {
  if (!this.settings.export) { return }
  console.log("Exporting to: ".blue + this.getExportPath())
  var output = fs.createWriteStream(this.getExportPath())
  var archive = archiver("zip")
  archive.on("error", function (err) {
    //TODO
    cb(err)
  })

  output.on("error", function (){
    //TODO
    cb(err)
  })

  output.on('close', function () {
    cb()
  });
  archive.pipe(output);
  archive.bulk([{
    expand: true,
    cwd: this.settings.imagesDir,
    src: ['**', '**/*.png', "*.png"]
  } ])
  archive.finalize();
}

ExportResults.prototype.getExportPath = function () {
  var command = swig.render(this.settings.exportPath, {  locals: {
    sample_env: this.settings.targetEnv,
    base_env: this.settings.baselineEnv,
    date: (new Date()).toISOString()
  }})
  return command
}

module.exports = ExportResults