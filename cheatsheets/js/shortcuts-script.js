$(document).ready(function () {
  // Create column containers
  var col1 = $("<div class='column' id='col1'></div>");
  var col2 = $("<div class='column' id='col2'></div>");
  var col3 = $("<div class='column' id='col3'></div>");

  $("#content").append(col1, col2, col3);

  $.each(data, function (_, section) {
    var rendered = render_section(section);
    if (section.column === 1) {
      col1.append(rendered);
    } else if (section.column === 2) {
      col2.append(rendered);
    } else {
      col3.append(rendered);
    }
  });

  $(".to_hide").remove();
});

function render_section(section) {
  var section_container = $("<div class='section_container'>");
  if (section.section === "Legend") {
    section_container.addClass("legend-section");
  }
  section_container.append(
    "<div class='section_header'>" + section.section + "</div>",
  );

  $.each(section.actions, function (_index, action) {
    var cloned = $("#template").clone();
    $(cloned).removeAttr("id");
    $(".name", cloned).text(action.name);
    $(".secondary", cloned).text(action.secondary);
    $(".description", cloned).text(action.description);
    $(".extra", cloned).text(action.extra);
    if (action.selection) {
      $(cloned).addClass("selection-mode");
    }

    $(".buttons", cloned).removeClass().addClass("buttons");
    $(".buttons", cloned).addClass("buttons " + action.command);
    section_container.append(cloned);
  });
  return section_container;
}
