// 2016 03 22 Hiroya Tanaka

// mod_path.js
//   fab modules path calculation routines
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

define(['require',
   'mods/mod_globals',
   'mods/mod_ui',
   'mods/mod_file',
   'processes/mod_path_view',
   'processes/mod_image',
   'handlebars',
   'text!templates/mod_path_calculate.html',
   'text!templates/mod_path_file_controls.html',
   'text!templates/mod_path_file_controls_inner.html',
   'text!templates/mod_path_image_2D_controls.html',
   'text!templates/mod_path_image_21D_controls.html',
   'text!templates/mod_path_image_22D_controls.html',
   'text!templates/mod_path_image_25D_controls.html',
   'text!templates/mod_path_image_3D_controls.html',
   'text!templates/mod_path_image_halftone_controls.html'
], function(require) {

   var globals = require('mods/mod_globals');
   var ui = require('mods/mod_ui');
   var mod_file = require('mods/mod_file');
   var path_view = require('processes/mod_path_view');
   var imageUtils = require('processes/mod_image');
   var handlebars = require('handlebars')
   var mod_path_calculate_tpl = handlebars.compile(require('text!templates/mod_path_calculate.html'))
   var mod_path_file_controls_tpl = handlebars.compile(require('text!templates/mod_path_file_controls.html'))
   var mod_path_file_controls_inner_tpl = handlebars.compile(require('text!templates/mod_path_file_controls_inner.html'))
   var mod_path_image_2D_controls_tpl = handlebars.compile(require('text!templates/mod_path_image_2D_controls.html'))
   var mod_path_image_21D_controls_tpl = handlebars.compile(require('text!templates/mod_path_image_21D_controls.html'))
   var mod_path_image_22D_controls_tpl = handlebars.compile(require('text!templates/mod_path_image_22D_controls.html'))
   var mod_path_image_25D_controls_tpl = handlebars.compile(require('text!templates/mod_path_image_25D_controls.html'))
   var mod_path_image_3D_controls_tpl = handlebars.compile(require('text!templates/mod_path_image_3D_controls.html'))
   var mod_path_image_halftone_controls_tpl = handlebars.compile(require('text!templates/mod_path_image_halftone_controls.html'))
   findEl = globals.findEl;

   //
   // defines
   //
   var X = 0
   var Y = 1
   var Z = 2

   //
   // mod_path_file_controls
   //    path file save and send controls
   //

      function mod_path_calculate() {
         controls = findEl("mod_commands")
         ctx = {
            server: globals.server
         }
         controls.innerHTML += mod_path_calculate_tpl(ctx)
      }

      function mod_path_file_controls(routine, modname) {
         controls = findEl("mod_manipulate")
         ctx = {
            server: globals.server
         }
         controls.innerHTML += mod_path_file_controls_tpl(ctx)

         label_manipulate = findEl("mod_manipulate_label");
         label_manipulate.addEventListener("click", function() {
           div_manipulate = findEl("mod_manipulate_menu");
           div_manipulate.innerHTML = mod_path_file_controls_inner_tpl(ctx)
           mod_path_file_controls_events(routine,modname);
         });
      }

      // moving events out of the template building routine
      function mod_path_file_controls_events(routine,routineModName){
         require(['outputs/mod_' + routineModName], function(routineMod){

            var routineFun = routineMod[routine];

         save_btn = findEl("mod_save");
         save_btn.addEventListener("click", function() {
            /* logger : record process */

            var input_vals = new Object();
            var output_vals = new Object();
            var process_vals = new Object();
            inputs = $("#mod_input_controls > select, #mod_input_controls > input");
            for (var i=0; i<inputs.length; i++) {
              input_vals[inputs[i].id] = inputs[i].value;
            }
            outputs = $("#mod_output_controls > select, #mod_output_controls > input");
            for (var i=0; i<outputs.length; i++) {
              output_vals[outputs[i].id] = outputs[i].value;
            }
            processes = $("#mod_process_controls > select, #mod_process_controls > input");
            for (var i=0; i<processes.length; i++) {
              process_vals[processes[i].id] = processes[i].value;
             // console.log(processes[i].value);
            }

            var params = {
              input : input_vals,
              output : output_vals,
              process : process_vals
            };

            if (globals.path == undefined) {
               ui.ui_prompt("path not calculated");
            } else {

// save input file to the server 
/*
    var inputfile =  globals.input_name_timestamp;
    var inputname =  globals.input_file;


      var formData = new FormData();
       formData.append('filename', globals.input_name_timestamp);
       formData.append('files', inputfile);

       console.log('png upload filename '+  globals.input_name_timestamp);
       console.log('png upload file '+   globals.input_file);

      $.ajax({
        url: "/uploads",
        type: "post",
        data: formData,
        processData: false,
        contentType: false
      });

*/


///save setting file to the server


              var settingfile = Date.now()+'-setting.json';

console.log('input '+input_vals);
console.log('output '+output_vals);
console.log('process '+process_vals);

              var formData = new FormData();
formData.append('file',JSON.stringify(params));
             // formData.append('input',input_vals);
             // formData.append('output',output_vals);
             // formData.append('process' ,process_vals);
              formData.append('filename',settingfile);

              $.ajax({
                url: "/settings",
                type: "post",
                data: formData,
                processData: false,
                contentType: false
              });


   var file = routineFun(globals.path);
   var name =  Date.now()+'-'+globals.input_basename + globals.type;

//// save output file to local
  mod_file.save(name, file);

/// save output file to the server



      var formData = new FormData();
              formData.append('filename', name);
              formData.append('file', file);

      console.log('uploads:filename '+ name);
      console.log('uploads:file '+ file);

      $.ajax({
        url: "/uploadsout",
        type: "post",
        data: formData,
        processData: false,
        contentType: false
      });


//// save logs

              var formData = new FormData();

if (document.getElementById("mod_username").value.includes(',')){
              formData.append('location', document.getElementById("mod_username").value);
} else { 
 formData.append('location', "nodata");
}
              formData.append('input', globals.input_name);
              formData.append('output', name);
              formData.append('settings', settingfile);
            //  formData.append('content', "Process : save");

//              formData.append('params', JSON.stringify(params));


      console.log('log:location '+ document.getElementById("mod_username").value);
      console.log('log:input '+ globals.input_name);
    console.log('log:output '+  name );
    console.log('log:settings '+ settingfile );


              $.ajax({
                url: "/logs",
                type: "post",
                data: formData,
                processData: false,
                contentType: false
              });



            }
         });

         send_btn = findEl("mod_send");
         send_btn.addEventListener("click", function() {
            /* logger : record process */
            var input_vals = new Object();
            var output_vals = new Object();
            var process_vals = new Object();
            inputs = $("#mod_input_controls > select, #mod_input_controls > input");
            for (var i=0; i<inputs.length; i++) {
              input_vals[inputs[i].id] = inputs[i].value;
            }
            outputs = $("#mod_output_controls > select, #mod_output_controls > input");
            for (var i=0; i<outputs.length; i++) {
              output_vals[outputs[i].id] = outputs[i].value;
            }
            processes = $("#mod_process_controls > select, #mod_process_controls > input");
            for (var i=0; i<processes.length; i++) {
              process_vals[processes[i].id] = processes[i].value;
            //  console.log(processes[i].value);
            }

/*
            var params = {
              input : input_vals,
              output : output_vals,
              process : process_vals
            };

            if (globals.path == undefined) {
              ui.ui_prompt("path not calculated");
            } else {
              var file = routineFun(globals.path);
              var name = globals.input_basename + globals.type;

              var formData = new FormData();

              formData.append('content', mod_file_basename);
              formData.append('filename', name);
              formData.append('file', output);

              formData.append('content', "Process : send");
              formData.append('user', document.getElementById("mod_username").value);
              formData.append('params', JSON.stringify(params));
              $.ajax({
                url: "/record",
                type: "post",
                data: formData,
                processData: false,
                contentType: false
              });
                  }
*/

              var command = findEl("mod_command").value;
              var server = findEl("mod_server").value;
              mod_file.send(name, file, command, server);

         });

         });
      }
      //
      // mod_path_image_2D
      //    path from image 2D (intensity)
      //

      function mod_path_image_2D() {
         //
         // clear display
         //
         ui.ui_clear()
         ui.ui_prompt('calculating path')
         //
         // get images
         //
         var input_canvas = findEl("mod_input_canvas")
         var process_canvas = findEl("mod_process_canvas")
         var output_canvas = findEl("mod_output_canvas")
         var input_ctx = input_canvas.getContext("2d")
         var input_img = input_ctx.getImageData(0, 0, input_canvas.width, input_canvas.height)
         var process_ctx = process_canvas.getContext("2d")
         process_ctx.drawImage(input_canvas, 0, 0)
         var process_img = process_ctx.getImageData(0, 0, process_canvas.width, process_canvas.height)
         var output_ctx = output_canvas.getContext("2d")
         var output_img = output_ctx.getImageData(0, 0, output_canvas.width, output_canvas.height)
         //
         // get arguments
         //
         var threshold = parseFloat(findEl("mod_threshold").value)
         var number = parseInt(findEl("mod_offsets").value)
         var diameter = parseFloat(findEl("mod_diameter").value)
         var overlap = parseFloat(findEl("mod_overlap").value)
         var error = parseFloat(findEl("mod_error").value)
         var direction = true
         var sorting = findEl("mod_sort").checked
         var sort_merge = parseFloat(findEl("mod_merge").value)
         var sort_order = parseFloat(findEl("mod_order").value)
         var sort_sequence = parseFloat(findEl("mod_sequence").value)
         //
         // set up path Web worker
         //
         var worker = new Worker('processes/mod_path_worker.js')
         var path = []
         worker.addEventListener('message', function(e) {
            if (e.data[0] == 'prompt')
            //
            // prompt message from worker
            //
               ui.ui_prompt(e.data[1])
            else if (e.data[0] == 'console')
            //
            // console message from worker
            //
               console.log(e.data[1])
            else if (e.data[0] == 'path') {
               //
               // partial path message from worker
               //
               path = e.data[1]
               //
               // show path
               //
               path_view.show_gl(path)
            } else if (e.data[0] == 'return') {
               //
               // complete path message from worker
               //
               path = e.data[1]
               //
               // call continue event
               //
               var event = new Event('continue_2D')
               dispatchEvent(event)
            }
         }, false)
         //
         // add continue event
         //
         addEventListener('continue_2D', function(e) {
            //
            // show path
            //
            path_view.show_gl(path)
            //
            // add path to DOM
            //
            globals.path = path
            //
            // terminate worker
            //
            worker.terminate()
         }, false)
         //
         // start worker
         //
         worker.postMessage(["mod_path_worker_image_2D_calculate", process_img, output_img,
            threshold, number, diameter, overlap, error, direction, sorting, sort_merge, sort_order, sort_sequence, globals.dpi
         ])
      }
      //
      // mod_path_image_2D_controls
      //    path from image 2D controls (intensity)
      //

      function mod_path_image_2D_controls(routine,modname) {
         var controls = findEl("mod_process_controls")

         controls.innerHTML = "<b>process</b>"
         mod_path_calculate()
         mod_path_file_controls(routine, modname)

         controls.innerHTML += mod_path_image_2D_controls_tpl();


         findEl('mod_path',false).addEventListener("click", function(ev) {
            mod_path_image_2D();
         });

      }

      //
      // mod_path_image_21D
      //    path from image 2.1D (intensity, depth)
      //

      function mod_path_image_21D() {
         //
         // clear display
         //
         ui.ui_clear()
         ui.ui_prompt('calculating path')
         //
         // get images
         //
         var input_canvas = findEl("mod_input_canvas")
         var process_canvas = findEl("mod_process_canvas")
         var output_canvas = findEl("mod_output_canvas")
         var input_ctx = input_canvas.getContext("2d")
         var input_img = input_ctx.getImageData(0, 0, input_canvas.width, input_canvas.height)
         var process_ctx = process_canvas.getContext("2d")
         process_ctx.drawImage(input_canvas, 0, 0)
         var process_img = process_ctx.getImageData(0, 0, process_canvas.width, process_canvas.height)
         var output_ctx = output_canvas.getContext("2d")
         var output_img = output_ctx.getImageData(0, 0, output_canvas.width, output_canvas.height)
         //
         // get arguments
         //
         var threshold = parseFloat(findEl("mod_threshold").value)
         var number = parseInt(findEl("mod_offsets").value)
         var diameter = parseFloat(findEl("mod_diameter").value)
         var overlap = parseFloat(findEl("mod_overlap").value)
         var error = parseFloat(findEl("mod_error").value)
         var direction = findEl("mod_climb").checked
         var sorting = findEl("mod_sort").checked
         var sort_merge = parseFloat(findEl("mod_merge").value)
         var sort_order = parseFloat(findEl("mod_order").value)
         var sort_sequence = parseFloat(findEl("mod_sequence").value)
         //
         // set up path Web worker
         //
         var worker = new Worker('processes/mod_path_worker.js')
         var path2 = []
         worker.addEventListener('message', function(e) {
            if (e.data[0] == 'prompt')
            //
            // prompt message from worker
            //
               ui.ui_prompt(e.data[1])
            else if (e.data[0] == 'console')
            //
            // console message from worker
            //
               console.log(e.data[1])
            else if (e.data[0] == 'path') {
               //
               // partial path message from worker
               //
               path = e.data[1]
               //
               // show path
               //
               path_view.show_gl(path)
            } else if (e.data[0] == 'return') {
               //
               // path message from worker
               //
               path2 = e.data[1]
               //
               // call continue event
               //
               var event = new Event('continue_21D')
               dispatchEvent(event)
            }
         }, false)
         //
         // add continue event
         //
         addEventListener('continue_21D', function(e) {
            //
            // set z
            //
            var depth = parseFloat(findEl("mod_depth").value)
            var idepth = Math.floor(0.5 + globals.dpi * depth / 25.4)
            var path3 = []
            for (var seg = 0; seg < path2.length; ++seg) {
               path3[path3.length] = []
               for (var pt = 0; pt < path2[seg].length; ++pt) {
                  path3[path3.length - 1][path3[path3.length - 1].length] = [path2[seg][pt][X], path2[seg][pt][Y], -idepth]
               }
            }
            //
            // show path
            //
            path_view.show_gl(path3)
            //
            // add path to DOM
            //
            globals.path = path3
            //
            // terminate worker
            //
            worker.terminate()
         }, false)
         //
         // start worker
         //
         worker.postMessage(["mod_path_worker_image_2D_calculate", process_img, output_img,
            threshold, number, diameter, overlap, error, direction, sorting, sort_merge, sort_order, sort_sequence, globals.dpi
         ])
      }
      //
      // mod_path_image_21D_controls
      //    path from image 2.1D controls (intensity, depth)
      //

      function mod_path_image_21D_controls(routine,modname) {
         var controls = findEl("mod_process_controls")

         controls.innerHTML = "<b>process</b>"
         mod_path_calculate()
         mod_path_file_controls(routine, modname)
         controls.innerHTML += mod_path_image_21D_controls_tpl();

         findEl('mod_path',false).addEventListener("click", function() {
            mod_path_image_21D();
         });
      }
      //
      // mod_path_image_22D
      //    path from image 2.2D (intensity, depth, thickness)
      //

      function mod_path_image_22D() {
         //
         // clear display
         //
         ui.ui_clear()
         ui.ui_prompt('calculating path')
         //
         // get images
         //
         var input_canvas = findEl("mod_input_canvas")
         var process_canvas = findEl("mod_process_canvas")
         var output_canvas = findEl("mod_output_canvas")
         var input_ctx = input_canvas.getContext("2d")
         var input_img = input_ctx.getImageData(0, 0, input_canvas.width, input_canvas.height)
         var process_ctx = process_canvas.getContext("2d")
         process_ctx.drawImage(input_canvas, 0, 0)
         var process_img = process_ctx.getImageData(0, 0, process_canvas.width, process_canvas.height)
         var output_ctx = output_canvas.getContext("2d")
         var output_img = output_ctx.getImageData(0, 0, output_canvas.width, output_canvas.height)
         //
         // get arguments
         //
         var threshold = parseFloat(findEl("mod_threshold").value)
         var number = parseInt(findEl("mod_offsets").value)
         var diameter = parseFloat(findEl("mod_diameter").value)
         var overlap = parseFloat(findEl("mod_overlap").value)
         var error = parseFloat(findEl("mod_error").value)
         var direction = findEl("mod_climb").checked
         var sorting = findEl("mod_sort").checked
         var sort_merge = parseFloat(findEl("mod_merge").value)
         var sort_order = parseFloat(findEl("mod_order").value)
         var sort_sequence = parseFloat(findEl("mod_sequence").value)
         //
         // set up path Web worker
         //
         var worker = new Worker('processes/mod_path_worker.js')
         var path2 = []
         worker.addEventListener('message', function(e) {
            if (e.data[0] == 'prompt')
            //
            // prompt message from worker
            //
               ui.ui_prompt(e.data[1])
            else if (e.data[0] == 'console')
            //
            // console message from worker
            //
               console.log(e.data[1])
            else if (e.data[0] == 'path') {
               //
               // partial path message from worker
               //
               path = e.data[1]
               //
               // show path
               //
               path_view.show_gl(path)
            } else if (e.data[0] == 'image') {
               //
               // image (debugging) message from worker
               //
               img = e.data[1]
               ui.ui_clear()
               canvas = findEl("mod_output_canvas")
               canvas.width = img.width
               canvas.height = img.height
               canvas.style.display = "inline"
               var ctx = canvas.getContext("2d")
               ctx.putImageData(img, 0, 0)
            } else if (e.data[0] == 'return') {
               //
               // path message from worker
               //
               if (e.data[1] != -1) {
                  //
                  // path returned, call continue event
                  //
                  path2 = e.data[1]
                  var event = new Event('continue_22D')
                  dispatchEvent(event)
               }
            }
         }, false)
         //
         // add continue event
         //
         addEventListener('continue_22D', function(e) {
            //
            // get settings
            //
            var depth = parseFloat(findEl("mod_depth").value)
            var thick = parseFloat(findEl("mod_thickness").value)
            var path3 = []
            //
            // loop over segments
            //
            for (var seg = 0; seg < path2.length; ++seg) {
               var z = 0
               path3[path3.length] = []
               //
               // loop over z values
               //
               while (z < thick) {
                  z += depth
                  if (z > thick)
                     z = thick
                  var iz = Math.floor(0.5 + globals.dpi * z / 25.4)
                  //
                  // start new segment if ends don't meet
                  //
                  if ((path3[path3.length - 1].length > 0) && ((path2[seg][0][X] != path2[seg][path2[seg].length - 1][X]) || (path2[seg][0][Y] != path2[seg][path2[seg].length - 1][Y])))
                     path3[path3.length] = []
                     //
                     // add points
                     //
                  for (var pt = 0; pt < path2[seg].length; ++pt) {
                     path3[path3.length - 1][path3[path3.length - 1].length] = [path2[seg][pt][X], path2[seg][pt][Y], -iz]
                  }
               }
            }
            //
            // show path
            //
            path_view.show_gl(path3)
            //
            // add path to DOM
            //
            globals.path = path3
            //
            // terminate worker
            //
            worker.terminate()
         }, false)
         //
         // start worker
         //
         worker.postMessage(["mod_path_worker_image_2D_calculate", process_img, output_img,
            threshold, number, diameter, overlap, error, direction, sorting, sort_merge, sort_order, sort_sequence, globals.dpi
         ])
      }
      //
      // mod_path_image_22D_controls
      //    path from image 2.2D controls (intensity, depth, thickness)
      //

      function mod_path_image_22D_controls(routine,modname) {
         var controls = findEl("mod_process_controls")

         controls.innerHTML = "<b>process</b>"
         mod_path_calculate()
         mod_path_file_controls(routine, modname)

         controls.innerHTML += mod_path_image_22D_controls_tpl();

         findEl("mod_path",false).addEventListener("click", function() {
            mod_path_image_22D();
         });
      }
      //
      // mod_path_image_25D
      //    path from image 2.5D (rough cut)
      //

      function mod_path_image_25D() {
         //
         // clear display
         //
         ui.ui_clear()
         ui.ui_prompt('calculating path')
         //
         // get images
         //
         var input_canvas = findEl("mod_input_canvas")
         var process_canvas = findEl("mod_process_canvas")
         var output_canvas = findEl("mod_output_canvas")
         var input_ctx = input_canvas.getContext("2d")
         var input_img = input_ctx.getImageData(0, 0, input_canvas.width, input_canvas.height)
         var process_ctx = process_canvas.getContext("2d")
         process_ctx.drawImage(input_canvas, 0, 0)
         var process_img = process_ctx.getImageData(0, 0, process_canvas.width, process_canvas.height)
         var output_ctx = output_canvas.getContext("2d")
         var output_img = output_ctx.getImageData(0, 0, output_canvas.width, output_canvas.height)
         //
         // get arguments
         //
         var number = parseInt(findEl("mod_offsets").value)
         var diameter = parseFloat(findEl("mod_diameter").value)
         var overlap = parseFloat(findEl("mod_overlap").value)
         var error = parseFloat(findEl("mod_error").value)
         var direction = findEl("mod_climb").checked
         var sorting = findEl("mod_sort").checked
         var sort_merge = parseFloat(findEl("mod_merge").value)
         var sort_order = parseFloat(findEl("mod_order").value)
         var sort_sequence = parseFloat(findEl("mod_sequence").value)
         var bottom_z = parseFloat(findEl("mod_bottom_z").value)
         var bottom_i = parseFloat(findEl("mod_bottom_i").value)
         var top_z = parseFloat(findEl("mod_top_z").value)
         var top_i = parseFloat(findEl("mod_top_i").value)
         var depth = parseFloat(findEl("mod_depth").value)
         //
         // set up path Web worker
         //
         var worker = new Worker('processes/mod_path_worker.js')
         var path3 = []
         var z = top_z
         worker.addEventListener('message', function(e) {
            if (e.data[0] == 'prompt')
            //
            // prompt message from worker
            //
               ui.ui_prompt('layer ' + z + '/' + bottom_z + ' : ' + e.data[1])
            else if (e.data[0] == 'console')
            //
            // console message from worker
            //
               console.log(e.data[1])
            else if (e.data[0] == 'path') {
               //
               // partial path message from worker
               //
               path = e.data[1]
               //
               // show path
               //
               path_view.show_gl(path)
            } else if (e.data[0] == 'return') {
               //
               // path message from worker
               //
               var path2 = e.data[1]
               //
               // accumulate layer
               //
               var i = bottom_i + (top_i - bottom_i) * (z - bottom_z) / (top_z - bottom_z)
               var iz = Math.floor(0.5 + globals.dpi * z / 25.4)
               for (var seg = 0; seg < path2.length; ++seg) {
                  path3[path3.length] = []
                  for (var pt = 0; pt < path2[seg].length; ++pt) {
                     path3[path3.length - 1][path3[path3.length - 1].length] = [path2[seg][pt][X], path2[seg][pt][Y], iz]
                  }
               }
               //
               // show path
               //
               path_view.show_gl(path3)
               //
               // loop
               //
               if (z <= bottom_z) {
                  //
                  // call continue event
                  //
                  var event = new Event('continue_25D')
                  dispatchEvent(event)
               } else {
                  z -= depth
                  if (z < bottom_z)
                     z = bottom_z
                  var i = bottom_i + (top_i - bottom_i) * (z - bottom_z) / (top_z - bottom_z)
                  var iz = Math.floor(0.5 + globals.dpi * z / 25.4)
                  worker.postMessage(["mod_path_worker_image_2D_calculate", process_img, output_img,
                     i, number, diameter, overlap, error, direction, sorting, sort_merge, sort_order, sort_sequence, globals.dpi
                  ])
               }
            }
         }, false)
         //
         // add continue event
         //
         addEventListener('continue_25D', function(e) {
            //
            // add path to DOM
            //
            globals.path = path3
            //
            // terminate worker
            //
            worker.terminate()
         }, false)
         //
         // start worker
         //
         z -= depth
         if (z < bottom_z)
            z = bottom_z
         var i = bottom_i + (top_i - bottom_i) * (z - bottom_z) / (top_z - bottom_z)
         var iz = Math.floor(0.5 + globals.dpi * z / 25.4)
         worker.postMessage(["mod_path_worker_image_2D_calculate", process_img, output_img,
            i, number, diameter, overlap, error, direction, sorting, sort_merge, sort_order, sort_sequence, globals.dpi
         ])
      }
      //
      // mod_path_image_25D_controls
      //    path from image 2.5D controls (rough cut)
      //

      function mod_path_image_25D_controls(routine,modname) {
         var controls = findEl("mod_process_controls")

         controls.innerHTML = "<b>process</b>"
         mod_path_calculate()
         mod_path_file_controls(routine, modname)

         controls.innerHTML += "<br>bottom z (mm):"
         if (globals.zmin == "")
            controls.innerHTML += "<br>&nbsp;&nbsp;&nbsp;<input type='text' id='mod_bottom_z' size='3' value='-10'>"
         else
            controls.innerHTML += "<br>&nbsp;&nbsp;&nbsp;<input type='text' id='mod_bottom_z' size='3' value='" + globals.zmin.toFixed(3) + "'>"

         controls.innerHTML += mod_path_image_25D_controls_tpl();

         findEl("mod_path",false).addEventListener("click", function() {
            mod_path_image_25D();
         });
      }

      //
      // mod_path_image_3D
      //    path from image 3D (finish cut)
      //

      function mod_path_image_3D() {
         //
         // clear display
         //
         ui.ui_clear()
         ui.ui_prompt('calculating path')
         //
         // get images
         //
         var input_canvas = findEl("mod_input_canvas")
         var process_canvas = findEl("mod_process_canvas")
         var output_canvas = findEl("mod_output_canvas")
         var input_ctx = input_canvas.getContext("2d")
         var input_img = input_ctx.getImageData(0, 0, input_canvas.width, input_canvas.height)
         var process_ctx = process_canvas.getContext("2d")
         process_ctx.drawImage(input_canvas, 0, 0)
         var process_img = process_ctx.getImageData(0, 0, process_canvas.width, process_canvas.height)
         //
         // get settings
         //
         var bottom_z = parseFloat(findEl("mod_bottom_z").value)
         var bottom_i = parseFloat(findEl("mod_bottom_i").value)
         var top_z = parseFloat(findEl("mod_top_z").value)
         var top_i = parseFloat(findEl("mod_top_i").value)
         var diameter = parseFloat(findEl("mod_diameter").value)
         var overlap = parseFloat(findEl("mod_overlap").value)
         var type = findEl("mod_flat").checked
         var xz = findEl("mod_xz").checked
         var yz = findEl("mod_yz").checked
         var error = parseFloat(findEl("mod_error").value)
         //
         // set up path Web worker
         //
         var worker = new Worker('processes/mod_path_worker.js')
         var path = []
         worker.addEventListener('message', function(e) {
            if (e.data[0] == 'prompt')
            //
            // prompt message from worker
            //
               ui.ui_prompt(e.data[1])
            else if (e.data[0] == 'console')
            //
            // console message from worker
            //
               console.log(e.data[1])
               /*
      else if (e.data[0] == 'collision') {
         //
         // collision message from worker
         //
         collision = e.data[1]
         }
      */
            else if (e.data[0] == 'path') {
               //
               // partial path message from worker
               //
               path = e.data[1]
               path_view.show_gl(path)
            } else if (e.data[0] == 'return') {
               //
               // complete path message from worker
               //
               path = e.data[1]
               //
               // call continue event
               //
               var event = new Event('continue_3D')
               dispatchEvent(event)
            }
         }, false)
         //
         // add continue event
         //
         addEventListener('continue_3D', function(e) {
            /*
      //
      // check for collision
      //
      if (collision)
         mod_ui_prompt("error: tool collision")
      */
            //
            // add path to DOM
            //
            globals.path = path
         }, false)
         //
         // start worker
         //
         worker.postMessage(["mod_path_worker_image_offset_z",
            process_img, diameter, overlap, type, xz, yz, error, globals.dpi, bottom_z, bottom_i, top_z, top_i
         ])
      }
      //
      // mod_path_image_3D_controls
      //    path from image 3D controls (rough cut)
      //

      function mod_path_image_3D_controls(routine,modname) {
         var controls = findEl("mod_process_controls")

         controls.innerHTML = "<b>process</b>"
         mod_path_calculate()
         mod_path_file_controls(routine, modname)

         controls.innerHTML += "<br>bottom z (mm):"
         if (globals.zmin == "")
            controls.innerHTML += "<br>&nbsp;&nbsp;&nbsp;<input type='text' id='mod_bottom_z' size='3' value='-10'>"
         else
            controls.innerHTML += "<br>&nbsp;&nbsp;&nbsp;<input type='text' id='mod_bottom_z' size='3' value='" + globals.zmin.toFixed(3) + "'>"

            controls.innerHTML += mod_path_image_3D_controls_tpl();

         findEl("mod_path",false).addEventListener("click", function() {
            mod_path_image_3D()
         });
      }
      //
      // mod_path_image_halftone_calculate
      //    path from image halftone calculate
      //

      function mod_path_image_halftone_calculate() {
         ui.ui_prompt("calculating path ...")
         //
         // clear display
         //
         ui.ui_clear()
         //
         // get image
         //
         var input_canvas = findEl("mod_input_canvas")
         var input_ctx = input_canvas.getContext("2d")
         var input_img = input_ctx.getImageData(0, 0, input_canvas.width, input_canvas.height)
         //
         // halftone
         //
         var diameter = parseFloat(findEl("mod_diameter").value)
         var spot_size = parseFloat(findEl("mod_spot_size").value)
         var spot_min = parseFloat(findEl("mod_spot_min").value)
         var spot_spacing_h = parseFloat(findEl("mod_spot_spacing_h").value)
         var spot_spacing_v = parseFloat(findEl("mod_spot_spacing_v").value)
         var spot_points = parseFloat(findEl("mod_spot_points").value)
         var spot_fill = findEl("mod_spot_fill").checked
         var path = imageUtils.halftone(input_img,
            diameter, spot_size, spot_min, spot_spacing_h, spot_spacing_v, spot_points, spot_fill)
         //
         // sort path
         //
         if (findEl("mod_spot_sort").checked)
            path = mod_path_sort(path)
            //
            // show path
            //
            //mod_path_show_2D_svg(path)
            //mod_path_show_2D_canvas(path)
         path_view.show_gl(path)
         //
         // add path to DOM
         //
         globals.path = path
         ui.ui_prompt("")
      }
      //
      // mod_path_image_halftone_controls
      //    path from image halftone controls
      //

      function mod_path_image_halftone_controls(type, routine,modname) {
         var controls = findEl("mod_process_controls")

         controls.innerHTML = "<b>process</b>"
         mod_path_calculate()
         mod_path_file_controls(routine,modname)

         controls.innerHTML += mod_path_image_halftone_controls_tpl();


         findEl("mod_path",false).addEventListener("click", function() {
            mod_path_image_halftone_calculate()
         });

      }

   var controls = {
      mod_path_file_controls: mod_path_file_controls,
      mod_path_image_2D_controls: mod_path_image_2D_controls,
      mod_path_image_3D_controls: mod_path_image_3D_controls,
      mod_path_image_21D_controls: mod_path_image_21D_controls,
      mod_path_image_22D_controls: mod_path_image_22D_controls,
      mod_path_image_25D_controls: mod_path_image_25D_controls,
      mod_path_image_halftone_controls: mod_path_image_halftone_controls
   };


   return {
      controls: controls,
      image_2D: mod_path_image_2D,
      image_3D: mod_path_image_3D,
      image_21D: mod_path_image_21D,
      image_halftone_calculate: mod_path_image_halftone_calculate,
      image_22D: mod_path_image_22D,
      image_25D: mod_path_image_25D,
   }

});
