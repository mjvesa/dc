import { createPropertyEditor, createPropertySelect } from "./dc-editor-fields";

const fn = (rect, DCAPI) => {
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  table.appendChild(
    createPropertyEditor("ID", event => {
      rect.props.id = event.target.value;
      DCAPI.repaint();
      event.stopPropagation();
    })
  );
  el.appendChild(table);
};

export const defaultEditor = {
  name: "default-editor",
  fn: fn
};
