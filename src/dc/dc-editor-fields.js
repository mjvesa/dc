export const createPropertyEditor = (caption, listener, length) => {
  const tr = document.createElement("tr");
  const captionTd = document.createElement("td");
  captionTd.textContent = caption;
  tr.appendChild(captionTd);
  const inputTd = document.createElement("td");
  const input = document.createElement("input");
  input.onmousedown = event => {
    event.stopPropagation();
  };
  input.style.width = length ? length : "4rem";
  input.type = "text";
  input.oninput = listener;
  inputTd.appendChild(input);
  tr.appendChild(inputTd);
  return tr;
};

export const createPropertySelect = (caption, options, listener) => {
  const tr = document.createElement("tr");
  const captionTd = document.createElement("td");
  captionTd.textContent = caption;
  tr.appendChild(captionTd);
  const inputTd = document.createElement("td");
  const input = document.createElement("select");
  input.style.zIndex = "100000";
  input.onmousedown = event => {
    event.stopPropagation();
  };
  options.forEach(option => {
    const optionEl = document.createElement("option");
    optionEl.textContent = option;
    input.appendChild(optionEl);
  });
  input.oninput = listener;
  inputTd.appendChild(input);
  tr.appendChild(inputTd);
  return tr;
};

export const fieldsFromProperties = (properties, table, rect, DCAPI) => {
  properties.forEach(prop => {
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
      case "color": {
        const editor = createPropertyEditor(prop[0], event => {
          rect.style[prop[0]] = event.target.value;
          DCAPI.repaint();
        });
        table.appendChild(editor);
        break;
      }
    }
  });
};

export const findAllIds = rects => {
  const ids = [];
  rects.forEach(rect => {
    if (rect.attributes.id) {
      ids.push(rect.attributes.id);
    }
  });
  return ids;
};
export const findAllIdsForTag = (rects, tag) => {
  const ids = [];
  rects.forEach(rect => {
    if (rect.attributes.id && rect.tag === tag) {
      ids.push(rect.attributes.id);
    }
  });
  return ids;
};

export const createIdSelect = (caption, DCAPI, listener) => {
  return createPropertySelect(caption, findAllIds(DCAPI.rects), listener);
};

export const createIdSelectForTag = (caption, tag, DCAPI, listener) => {
  return createPropertySelect(caption, findAllIds(DCAPI.rects), listener);
};
