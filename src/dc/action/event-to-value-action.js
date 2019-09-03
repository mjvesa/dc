// Takes one or two fields and a value. Once there is an event on one field, it
// takes the value of another field, or the same field, and
// sets it as the specified value.
import { createPropertyEditor, createIdSelect } from "../dc-editor-fields";

const fn = (rect, DCAPI) => {
  let varName, eventSourceElementId, valueElementId, eventName;
  const generateCode = () => {
    rect.props.textContent = `(function () {
        const el = document.getElementById('${eventSourceElementId}')
        el.addEventListener('${eventName}', event => {
            const valueEl = document.getElementById('${valueElementId}')
            window.variableListeners['${varName}'].setValue(valueEl.value);
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
    createIdSelect("Event source element Id", DCAPI, event => {
      eventSourceElementId = event.target.value;
      generateCode();
      event.stopPropagation();
    })
  );

  table.appendChild(
    createIdSelect("Value element Id", DCAPI, event => {
      valueElementId = event.target.value;
      generateCode();
      event.stopPropagation();
    })
  );

  table.appendChild(
    createPropertyEditor("Event", event => {
      eventName = event.target.value;
      generateCode();
      event.stopPropagation();
    })
  );

  el.appendChild(table);
};

export const eventToValueAction = {
  name: "event-to-value-action",
  displayname: "Event to value",
  fn: fn
};
