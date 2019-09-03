import {
  createPropertyEditor,
  createPropertySelect
} from "../dc-editor-fields";

const fn = (rect, DCAPI) => {
  const el = rect.el;
  el.textContent = "";

  const attribute = (id, caption, rect, table) => {
    table.appendChild(
      createPropertyEditor(caption, event => {
        rect.attributes[id] = event.target.value;
        DCAPI.repaint();
        event.stopPropagation();
      })
    );
  };

  const table = document.createElement("table");
  attribute("id", "Id", rect, table);
  attribute("class", "class", rect, table);

  el.appendChild(table);
};

export const defaultEditor = {
  name: "default-editor",
  displayname: "Default editor",
  fn: fn
};
