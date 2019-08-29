import { createPropertyEditor, createPropertySelect } from "./dc-editor-fields";

const property = (id, caption, table) => {
  table.appendChild(
    createPropertyEditor(caption, event => {
      rect.props[id] = event.target.value;
      DCAPI.repaint();
      event.stopPropagation();
    })
  );
};
const fn = (rect, DCAPI) => {
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  property("id", "Id", table);
  property("class", "class", table);

  /*  table.appendChild(
    createPropertyEditor("ID", event => {
      rect.props.id = event.target.value;
      DCAPI.repaint();
      event.stopPropagation();
    })
  );*/
  el.appendChild(table);
};

export const defaultEditor = {
  name: "default-editor",
  fn: fn
};
