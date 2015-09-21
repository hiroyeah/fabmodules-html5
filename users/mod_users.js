define(['mods/mod_ui', 'inputs/mod_inputs'], function(ui, inputs) {
  function mod_users() {
    var name = document.getElementById("mod_username");
    name.addEventListener("keypress", function(e) {
      if (e.keyCode == 13) {
        if (name.value) {
          var name_wrapper = document.getElementById("mod_user_menu");
          name_wrapper.setAttribute("style", "display:none");
          inputs.initInputs();
        }
      }
    }, false)
    name.addEventListener("change", function(e) {
      if (name.value) {
        var name_wrapper = document.getElementById("mod_user_menu");
        name_wrapper.setAttribute("style", "display:none");
        inputs.initInputs();
      }
    }, false)

    var load_settings = document.getElementById("load_settings");
    var setting_file = document.getElementById("setting_file");
    load_settings.addEventListener("click", function (e) {
      if (setting_file) {
        setting_file.click();
      }
      e.preventDefault();
    }, false);

    setting_file.addEventListener("change", function (e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        var params = JSON.parse(e.target.result);
        for (var keys in params) {
          for (var element in params[keys]) {
            $('#' + element).val(params[keys][element]);
          }
        }
      }
      reader.readAsText(file);
    }, false);

    var save_settings = document.getElementById("save_settings");
    save_settings.addEventListener("click", function(e) {
      e.preventDefault();

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
        console.log(processes[i].value);
      }
      var params = {
        input : input_vals,
        output : output_vals,
        process : process_vals
      };

      var download_link = document.getElementById("mod_download")
      download_link.download = Date.now() + ".setting";
      download_link.href = "data:application/octet-stream," + encodeURI(JSON.stringify(params));
      var click_event = document.createEvent("MouseEvents")
      click_event.initEvent("click", true, false)
      download_link.dispatchEvent(click_event);
    }, false);

    ui.initGUI();
  }

  return {
    initUsers: mod_users
  }
});
