// An action that loads data from a REST endpoint using a list of ids.
import { createPropertyEditor, createPropertySelect } from "./dc-editor-fields";

const fn = (rect, DCAPI) => {
  // Create a textfield and load JSON from it when a specified element is clicked.
  const props = { clickSourceId: "", varName: "", itemPath: "", restUrl: "" };

  const generateRestCall = ({
    clickSourceId,
    itemPath,
    listvarname,
    varName,
    restUrl
  }) => {
    rect.props.textContent = `(function () {
    window.variableListeners['${listVarName}']('addListener', value => {
     // TODO: use the list to do fetching
       fetch('${restUrl}')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        const items = [];
        data.forEach( datum => {
          items.push({'${itemPath}':datum});
        });
        window.variableListeners['${varName}']('setValue', items);
        const grid = document.getElementById('${gridId}');
        grid.items = items;
        grid.notifyResize();
    });
    })();`;
  };

  const updateScript = () => {
    generateRestCall(props);
    DCAPI.repaint();
    event.stopPropagation();
  };
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  const property = (caption, id) => {
    table.appendChild(
      createPropertyEditor(caption, event => {
        props[id] = event.target.value;
        updateScript();
      })
    );
  };
  property("Click source Id", "clickSourceId");
  property("List Variable", "listVarName");
  property("Variable", "varName");
  property("Item path", "itemPath");
  property("REST URL", "restUrl");

  el.appendChild(table);
};

export const listRestAction = {
  name: "list-rest-action",
  displayname: "List REST action",
  fn: fn
};
