import { createPropertyEditor, createPropertySelect } from "./dc-editor-fields";

const fn = (rect, DCAPI) => {
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  table.appendChild(
    createPropertyEditor("Header", event => {
      rect.props.header = event.target.value;
      DCAPI.repaint();
      event.stopPropagation();
    })
  );
  table.appendChild(
    createPropertyEditor("Path", event => {
      rect.props.path = event.target.value;
      DCAPI.repaint();
      event.stopPropagation();
    })
  );

  el.appendChild(table);
};

export const vaadinGridColumnEditor = {
  name: "vaadin-grid-column-editor",
  fn: fn
};
