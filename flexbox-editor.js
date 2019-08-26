import { createPropertyEditor, createPropertySelect } from "./dc-editor-fields";

const fn = (rect, DCAPI) => {
  const flexboxProps = [
    //    ["flex"], "This is the shorthand for flex-grow, flex-shrink and flex-basis combined.", do we need it?
    ["flexGrow", "number"],
    ["flexShrink", "number"],
    ["flexBasis", "size"],
    ["flexFlow", "finite", ["flex-direction", "flex-wrap"]],
    [
      "flexDirection",
      "finite",
      ["row", "row-reverse", "column", "column-reverse"]
    ],
    ["flexWrap", "finite", ["nowrap", "wrap", "wrap-reverse"]],
    ["justifyContent"],
    [
      "alignItems",
      "finite",
      [
        "stretch",
        "center",
        "flex-start",
        "flex-end",
        "baseline",
        "initial",
        "inherit"
      ]
    ],
    [
      "alignContent",
      "finite",
      [
        "stretch",
        "center",
        "flex-start",
        "flex-end",
        "space-between",
        "space-around",
        "initial",
        "inherit"
      ]
    ],
    ,
    [
      "alignSelf",
      "finite",
      ["auto", "flex-start", "flex-end", "center", "baseline", "stretch"]
    ],
    ["order", "number"]
  ];

  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  rect.style.display = "flex";

  flexboxProps.forEach(prop => {
    switch (prop[1]) {
      case "number": {
        const editor = createPropertyEditor(prop[0], event => {
          rect.style[prop[0]] = event.target.value;
          DCAPI.repaint();
        });
        table.appendChild(editor);
        break;
      }
      case "finite": {
        const editor = createPropertySelect(prop[0], prop[2], event => {
          rect.style[prop[0]] = event.target.value;
          DCAPI.repaint();
        });
        table.appendChild(editor);
        break;
      }
      case "size": {
        const editor = createPropertyEditor(prop[0], event => {
          rect.style[prop[0]] = event.target.value;
          DCAPI.repaint();
        });
        table.appendChild(editor);
        break;
      }
    }
  });

  table.appendChild(
    createPropertyEditor("ID", event => {
      rect.props.id = event.target.value;
      DCAPI.repaint();
      event.stopPropagation();
    })
  );
  el.appendChild(table);
};

export const flexboxEditor = {
  name: "flexbox-editor",
  fn: fn
};
