import { createPropertyEditor, createIdSelect } from "../dc-editor-fields";

const fn = (rect, DCAPI) => {
  let varName, targetId, elementTag;
  const generateCode = () => {
    rect.props.textContent = `(function () {
        window.variableListeners['${varName}'].addListener( value => {
          const dataEl = document.createElement('${elementTag}');
          dataEl.textContent = value;
          document.getElementById('${targetId}').appendChild(dataEl);
        });
      })();`;
    DCAPI.repaint();
  };
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  table.appendChild(
    createPropertyEditor("Variable", event => {
      varName = event.target.value;
      generateCode();
      event.stopPropagation();
    })
  );
  table.appendChild(
    createPropertyEditor("Target element ID", event => {
      targetId = event.target.value;
      generateCode();
      event.stopPropagation();
    })
  );

  table.appendChild(
    createPropertyEditor("Tag", event => {
      elementTag = event.target.value;
      generateCode();
      event.stopPropagation();
    })
  );

  el.appendChild(table);
};

export const elementAppenderAction = {
  name: "element-appender-action",
  displayname: "Element appender",
  fn: fn
};
