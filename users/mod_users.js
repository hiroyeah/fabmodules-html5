define(['mods/mod_ui', 'inputs/mod_inputs'], function(ui, inputs) {
  function mod_users() {
    var name = document.getElementById("mod_username");
    name.addEventListener("change", function(e) {
      if (name.value) {
        var name_wrapper = document.getElementById("mod_user_menu");
        name_wrapper.setAttribute("style", "display:none");
        inputs.initInputs();
      }
    }, false)
    ui.initGUI();
  }

  return {
    initUsers: mod_users
  }
});
