//
// mod_svg_path.js
//   fab modules SVG path input
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2014
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the fab modules 
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
/*
 * mod_load_handler()
 * mod_svg_path_read_handler()
 * mod_svg_path_text_load_handler()
 * mod_svg_path_parse()
 */

define(['require', 'mods/mod_ui', 'mods/mod_globals', 'outputs/mod_outputs', 'mods/mod_file'], function(require) {

   var ui = require('mods/mod_ui');
   var globals = require('mods/mod_globals');
   var outputs = require('outputs/mod_outputs');
   var fileUtils = require('mods/mod_file');
   var findEl = globals.findEl;

   var MAXWIDTH = 10000

   //
   // mod_load_handler
   //   file load handler
   //

      function mod_load_handler() {
         var file = findEl("mod_file_input")
         // file.setAttribute("onchange", "mod_svg_path_read_handler()")
         file.addEventListener("change", function() {
            mod_svg_path_read_handler();
         });
      }
      //
      // mod_svg_path_read_handler
      //    SVG path read handler
      //

      function mod_svg_path_read_handler(event) {
         //
         // get input file
         //
         var file_input = findEl("mod_file_input")
         globals.input_file = file_input.files[0]
         globals.input_name = file_input.files[0].name
         globals.input_basename = fileUtils.basename(globals.input_name)
         //
         // read as text
         //
         var file_reader = new FileReader()
         file_reader.onload = mod_svg_path_text_load_handler
         file_reader.readAsText(globals.input_file)
      }
      //
      // mod_svg_path_text_load_handler
      //    SVG path text load handler
      //

      function mod_svg_path_text_load_handler(event) {
         //
         // set up UI
         //
         controls = findEl("mod_input_controls")

         controls.innerHTML = "<b>input</b><br>"
         var file_input = findEl("mod_file_input")
         controls.innerHTML += "file: " + globals.input_name + "<br>"
         controls.innerHTML += "size:<br>"
         controls.innerHTML += "<div id='mod_size'></div>"
         //
         // parse path
         //
         str = event.target.result
         result = mod_svg_path_parse(str)
         if (result == false)
            return
            //
            // display path
            //
            //
            // call outputs
            //
         ui.ui_prompt("output format?")
         outputs.init()
      }
      //
      // mod_svg_path_parse
      //    parse SVG path
      //

      function mod_svg_path_parse(str) {
         //
         // mm
         //    return dimension in mm and set units if found
         //
         function mm(str, ptr) {
            var start = 1 + str.indexOf("\"", ptr)
            var end = str.indexOf("\"", start + 1)
            var units = str.slice(end - 2, end)
            if (units == "px") {
               return (25.4 * parseFloat(str.slice(start, end - 2) / 90.0)) // Inkscape px default 90/inch
            } else if (units == "pt") {
               return (25.4 * parseFloat(str.slice(start, end - 2) / 72.0))
            } else if (units == "in") {
               return (25.4 * parseFloat(str.slice(start, end - 2)))
            } else if (units == "mm") {
               return (parseFloat(str.slice(start, end - 2)))
            } else if (units == "cm") {
               return (10.0 * parseFloat(str.slice(start, end - 2)))
            } else {
               return (parseFloat(str.slice(start, end)))
            }
         }
         //
         // strchr
         //    return first occurence of char in string, otherwise -1
         //

         function strchr(str, chr) {
            for (var i = 0; i < str.length; ++i) {
               if (str[i] == chr)
                  return i
            }
            return -1
         }
         //
         // next_number
         //    return next number after pointer
         //

         function next_number(str, ptr) {
            var haystack = "0123456789.-+"
            //
            // find start
            //
            var start = ptr
            while (1) {
               if (strchr(haystack, str[start]) != -1)
                  break
               ++start
            }
            //
            // find end
            //
            var end = start
            while (1) {
               if (strchr(haystack, str[end]) == -1)
                  break;
               ++end
            }
            return {
               value: parseFloat(str.slice(start, end)),
               index: end
            }
         }
         /*
         //
         // move pointer to end and return number
         //
         *number = strtod(*ptr,&end);
         *ptr = end;
         }
      */
         //
         // find SVG element
         //
         var ptr = str.indexOf("<svg")
         if (ptr == -1) {
            ui.ui_prompt("error: SVG element not found")
            return false
         }
         var stop = str.indexOf(">", ptr)
         //
         // get width and height
         //
         globals.dpi = 90 // Inkscape default for px
         var start = str.indexOf("width=", ptr)
         if ((start == -1) || (start > stop)) {
            ui.ui_prompt("error: no width")
            return false
         }
         var width = mm(str, start)
         var start = str.indexOf("height=", ptr)
         if ((start == -1) || (start > stop)) {
            ui.ui_prompt("error: no height")
            return false
         }
         var height = mm(str, start)
         var size = findEl('mod_size')
         size.innerHTML = "&nbsp;&nbsp;&nbsp;" + width.toFixed(3) + ' x ' + height.toFixed(3) + ' mm<br>'
         size.innerHTML += "&nbsp;&nbsp;&nbsp;" + (width / 25.4).toFixed(3) + ' x ' + (height / 25.4).toFixed(3) + ' in<br>'
         //
         // check for viewBox
         //
         var start = str.indexOf("viewBox=", ptr)
         if ((start == -1) || (start > stop)) {
            vxmin = 0
            vymin = 0
            vwidth = width
            vheight = height
         } else {
            var result = next_number(str, start)
            var vxmin = result.value
            var result = next_number(str, result.index)
            var vymin = result.value
            var result = next_number(str, result.index)
            var vwidth = result.value
            var result = next_number(str, result.index)
            var vheight = result.value
         }
         // console.log(vxmin)
//          console.log(vymin)
//          console.log(vwidth)
//          console.log(vheight)
      }


   return {
      mod_load_handler: mod_load_handler
   }


});
