/*
export const scriptEditor = (rect, DCAPI) => {
  const el = rect.el;
  const ta = document.createElement("textarea");
  ta.style.width = "100%";
  ta.style.height = "100%";
  ta.oninput = event => {
    rect.props.textContent = `(function() { ${ta.value} })();`;
    DCAPI.repaint();
    event.stopPropagation();
  };
  ta.onmousedown = event => {
    event.stopPropagation();
  };
  el.appendChild(ta);
};
*/

import { createPropertyEditor, createPropertySelect } from "./dc-editor-fields";

const fn = (rect, DCAPI) => {
  let clickId, dataId, targetId;
  const generateCode = () => {
    rect.props.textContent = `(function () {
        const el = document.getElementById('${clickId}');
        el.onclick = event => {
          const value = document.getElementById('${dataId}').value;
          const dataEl = document.createElement('li');
          dataEl.textContent = value;
          document.getElementById('${targetId}').appendChild(dataEl);
        }
      })();`;
    DCAPI.repaint();
  };
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  table.appendChild(
    createPropertyEditor("Click source ID", event => {
      clickId = event.target.value;
      generateCode();
      event.stopPropagation();
    })
  );
  table.appendChild(
    createPropertyEditor("Value source ID", event => {
      dataId = event.target.value;
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

  el.appendChild(table);
};

export const scriptEditor = {
  name: "script-editor",
  fn: fn
};
