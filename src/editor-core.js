import { tags } from "./tags";
import { designComponentEditors } from "./design-component-editors";

let $ = document.querySelector.bind(document);

const childOf = (rectA, rectB) => {
  return (
    rectA.left > rectB.left &&
    rectA.top > rectB.top &&
    rectA.right < rectB.right &&
    rectA.bottom < rectB.bottom
  );
};

const isVerticalLayout = rect => {
  if (!rect.children || rect.children.length < 2) {
    return false;
  }
  let result = true;
  rect.children.forEach(outer => {
    rect.children.forEach(inner => {
      const hdiff = Math.abs(outer.left - inner.left);
      const vdiff = Math.abs(outer.top - inner.top);
      if (hdiff > vdiff) {
        result = false;
      }
    });
  });

  return result;
};

const isHorizontalLayout = rect => {
  if (!rect.children || rect.children.length < 2) {
    return false;
  }
  let result = true;
  rect.children.forEach(outer => {
    rect.children.forEach(inner => {
      const hdiff = Math.abs(outer.left - inner.left);
      const vdiff = Math.abs(outer.top - inner.top);
      if (hdiff < vdiff) {
        result = false;
      }
    });
  });

  return result;
};

const createTreeFromRects = rects => {
  const roots = [];
  rects.forEach(rect => {
    let smallestArea = 10000000;
    let potentialParent;
    rects.forEach(parentRect => {
      const area =
        Math.abs(parentRect.right - parentRect.left) *
        Math.abs(parentRect.bottom - parentRect.top);
      if (area < smallestArea && childOf(rect, parentRect)) {
        potentialParent = parentRect;
        smallestArea = area;
      }
    });
    if (potentialParent) {
      const children = potentialParent.children || [];
      children.push(rect);
      potentialParent.children = children;
    } else {
      roots.push(rect);
    }
  });
  return roots;
};

const deleteRectChildren = rects => {
  rects.forEach(rect => {
    delete rect.children;
  });
};

const createAndAppendChildElementsToDOM = (parent, rects) => {
  rects.forEach(rect => {
    let el = document.createElement(rect.tag);
    parent.appendChild(el);

    if (rect.props) {
      Object.keys(rect.props).forEach(key => {
        el[key] = rect.props[key];
      });
    }

    if (rect.attributes) {
      Object.keys(rect.attributes).forEach(key => {
        el.setAttribute(key, rect.attributes[key]);
      });
    }

    if (rect.style) {
      Object.keys(rect.style).forEach(key => {
        el.style[key] = rect.style[key];
      });
    }

    if (isVerticalLayout(rect)) {
      rect.children.sort((rectA, rectB) => {
        return rectA.top - rectB.top;
      });
    }

    if (isHorizontalLayout(rect)) {
      rect.children.sort((rectA, rectB) => {
        return rectA.left - rectB.left;
      });
    }
    if (rect.children) {
      createAndAppendChildElementsToDOM(el, rect.children);
    }
  });
};

export const initEditorCore = () => {
  let rects = [];
  let draggedEl;
  let draggedRect = {};
  let originX, originY;
  let focusedElement;
  let isTranslating = false;
  let editors = {};

  const createElementSelect = () => {
    const span = document.createElement("span");
    span.setAttribute("id", "element-select");
    const editorSelect = document.createElement("select");
    editorSelect.setAttribute("id", "editor-select");
    editorSelect.oninput = event => {
      installBExpEditor(event.target.value);
    };

    const el = document.createElement("select");
    el.setAttribute("id", "tag-select");
    tags.forEach(tag => {
      const tagEl = document.createElement("option");
      tagEl.textContent = tag;
      el.appendChild(tagEl);
    });
    el.oninput = event => {
      const tag = el.value;
      // Make select be as wide as needed to show tag name
      el.style.width = 2 + el.value.length / 2.5 + "rem";
      focusedElement.rect.tag = tag;
      editors = {};
      editorSelect.innerHTML = "";
      let installedEditor = false;
      designComponentEditors.forEach(editor => {
        if (editor[0] === "*" || editor[0] === tag) {
          const editorName = editor[1].name;
          editors[editorName] = editor[1].fn;
          const option = document.createElement("option");
          option.textContent = editor[1].displayname;
          option.value = editorName;
          editorSelect.appendChild(option);
          if (editorName == tag + "-editor") {
            installBExpEditor(editorName);
            editorSelect.value = editorName;
            installedEditor = true;
          }
        }
      });
      if (!installedEditor) {
        installBExpEditor("default-editor");
      }
    };
    span.appendChild(el);
    span.appendChild(editorSelect);
    return span;
  };

  let elementSelect = createElementSelect();

  document.body.appendChild(elementSelect);

  const canvas = $("#sketch-canvas");

  const installBExpEditor = editorName => {
    const DCAPI = { rects: rects, repaint: compileModelToHTML };
    if (focusedElement) {
      focusedElement.rect.el.innerHTML = "";
      editors[editorName](focusedElement.rect, DCAPI);
    }
    compileModelToHTML();
  };
  document.body.onkeyup = event => {
    if (event.key === "Delete" && event.ctrlKey) {
      if (focusedElement) {
        let newRects = [];
        rects.forEach(rect => {
          if (rect != focusedElement.rect) {
            newRects.push(rect);
          }
        });
        rects = newRects;
        canvas.removeChild(focusedElement);
      }
    }
  };

  const fixZIndexes = rects => {
    const fixInternal = (rects, zIndex) => {
      rects.forEach(rect => {
        if (rect.el) {
          rect.el.style.zIndex = zIndex;
          rect.el.style.backgroundColor = `rgb(${255 - zIndex * 32},${255 -
            zIndex * 32},255)`;

          if (rect.children) {
            fixInternal(rect.children, zIndex + 1);
          }
        }
      });
    };
    fixInternal(rects, 1);
  };

  canvas.onmousedown = event => {
    if (event.shiftKey) {
      deleteRectChildren(rects);
      createTreeFromRects(rects);
      isTranslating = true;
      draggedEl = event.target;
      draggedRect = draggedEl.rect;
    } else {
      isTranslating = false;
      draggedEl = document.createElement("div");
      draggedRect = {
        el: draggedEl,
        tag: "div",
        props: {},
        attributes: {},
        style: {}
      };
      draggedEl.rect = draggedRect;
      draggedEl.style.zIndex = 1000;
      draggedEl.onmouseover = event => {
        event.target.focus();
        focusedElement = event.target;
      };

      originX = event.clientX;
      originY = event.clientY;
      draggedEl.style.position = "absolute";
      draggedEl.style.left = event.clientX + "px";
      draggedEl.style.top = event.clientY + "px";

      canvas.appendChild(draggedEl);
    }
  };

  canvas.onmousemove = event => {
    if (draggedEl) {
      if (isTranslating) {
        resizeSubRects(draggedRect, {
          right: draggedRect.right + event.movementX,
          top: draggedRect.top + event.movementY,
          left: draggedRect.left + event.movementX,
          bottom: draggedRect.bottom + event.movementY
        });
        draggedRect.left = draggedRect.left + event.movementX;
        draggedRect.top = draggedRect.top + event.movementY;
        draggedRect.right = draggedRect.right + event.movementX;
        draggedRect.bottom = draggedRect.bottom + event.movementY;

        repositionRect(draggedRect);
      } else {
        draggedEl.style.width = event.clientX - originX + "px";
        draggedEl.style.height = event.clientY - originY + "px";
        Object.assign(draggedRect, {
          left: originX,
          top: originY,
          right: event.clientX,
          bottom: event.clientY
        });
      }
    }
  };
  const topLeftHandle = $("#top-left-drag-handle");
  const topRightHandle = $("#top-right-drag-handle");
  const bottomLeftHandle = $("#bottom-left-drag-handle");
  const bottomRightHandle = $("#bottom-right-drag-handle");

  const repositionDragHandles = rect => {
    topLeftHandle.style.left = rect.left - 10 + "px";
    topLeftHandle.style.top = rect.top - 10 + "px";

    topRightHandle.style.left = rect.right - 10 + "px";
    topRightHandle.style.top = rect.top - 10 + "px";

    bottomLeftHandle.style.left = rect.left - 10 + "px";
    bottomLeftHandle.style.top = rect.bottom - 10 + "px";

    bottomRightHandle.style.left = rect.right - 10 + "px";
    bottomRightHandle.style.top = rect.bottom - 10 + "px";
  };

  const resizeSubRects = (prevRect, newRect) => {
    const xScale =
      (newRect.right - newRect.left) / (prevRect.right - prevRect.left);
    const yScale =
      (newRect.bottom - newRect.top) / (prevRect.bottom - prevRect.top);

    const resizeRects = rects => {
      rects.forEach(rect => {
        rect.top = newRect.top + (rect.top - prevRect.top) * yScale;
        rect.bottom = newRect.top + (rect.bottom - prevRect.top) * yScale;
        rect.left = newRect.left + (rect.left - prevRect.left) * xScale;
        rect.right = newRect.left + (rect.right - prevRect.left) * xScale;
        const el = rect.el;
        el.style.top = rect.top + "px";
        el.style.left = rect.left + "px";
        el.style.width = rect.right - rect.left + "px";
        el.style.height = rect.bottom - rect.top + "px";
        if (rect.children) {
          resizeRects(rect.children);
        }
      });
    };

    if (prevRect.children) {
      resizeRects(prevRect.children);
    }
  };

  const repositionRect = rect => {
    const el = rect.el;
    el.style.width = rect.right - rect.left + "px";
    el.style.height = rect.bottom - rect.top + "px";
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
  };

  const treeifyRects = () => {
    deleteRectChildren(rects);
    createTreeFromRects(rects);
  };

  const mouseOverRect = mouseOverEvent => {
    const targetEl = mouseOverEvent.target;
    const rect = targetEl.rect;
    if (rect) {
      mouseOverEvent.target.focus();
      focusedElement = mouseOverEvent.target;
      elementSelect.style.left = event.target.rect.left + "px";
      elementSelect.style.top = event.target.rect.top - 16 + "px";
      document.getElementById("tag-select").value = rect.tag;
      repositionDragHandles(rect);

      topLeftHandle.onmousedown = mouseDownEvent => {
        treeifyRects();
        const mouseMoveListener = event => {
          if (event.ctrlKey) {
            resizeSubRects(rect, {
              top: event.clientY,
              left: event.clientX,
              bottom: rect.bottom,
              right: rect.right
            });
          }

          rect.left = event.clientX;
          rect.top = event.clientY;
          repositionRect(rect);
          repositionDragHandles(rect);
        };
        $("#sketch-canvas").addEventListener("mousemove", mouseMoveListener);
        topLeftHandle.onmouseup = event => {
          $("#sketch-canvas").removeEventListener(
            "mousemove",
            mouseMoveListener
          );
        };
        mouseDownEvent.stopPropagation();
      };

      topRightHandle.onmousedown = mouseDownEvent => {
        treeifyRects();
        const mouseMoveListener = event => {
          rect.right = event.clientX;
          rect.top = event.clientY;
          repositionRect(rect);
          repositionDragHandles(rect);
        };
        $("#sketch-canvas").addEventListener("mousemove", mouseMoveListener);
        topRightHandle.onmouseup = event => {
          $("#sketch-canvas").removeEventListener(
            "mousemove",
            mouseMoveListener
          );
        };
        mouseDownEvent.stopPropagation();
      };

      bottomRightHandle.onmousedown = mouseDownEvent => {
        treeifyRects();
        const mouseMoveListener = event => {
          if (event.ctrlKey) {
            resizeSubRects(rect, {
              top: rect.top,
              left: rect.left,
              bottom: event.clientY,
              right: event.clientX
            });
          }
          rect.right = event.clientX;
          rect.bottom = event.clientY;
          repositionRect(rect);
          repositionDragHandles(rect);
        };
        $("#sketch-canvas").addEventListener("mousemove", mouseMoveListener);
        bottomRightHandle.onmouseup = event => {
          $("#sketch-canvas").removeEventListener(
            "mousemove",
            mouseMoveListener
          );
        };
        mouseDownEvent.stopPropagation();
      };
    }

    bottomLeftHandle.onmousedown = mouseDownEvent => {
      treeifyRects();
      const mouseMoveListener = event => {
        rect.left = event.clientX;
        rect.bottom = event.clientY;
        repositionRect(rect);
        repositionDragHandles(rect);
      };
      $("#sketch-canvas").addEventListener("mousemove", mouseMoveListener);
      bottomLeftHandle.onmouseup = event => {
        $("#sketch-canvas").removeEventListener("mousemove", mouseMoveListener);
      };
      mouseDownEvent.stopPropagation();
    };
  };

  canvas.onmouseup = () => {
    if (!isTranslating && draggedEl) {
      rects.push(draggedRect);
      draggedEl.onmouseover = mouseOverRect;
    }
    draggedEl = undefined;
    deleteRectChildren(rects);
    const roots = createTreeFromRects(rects);
    fixZIndexes(roots);
    compileModelToHTML();
  };

  const compileModelToHTML = () => {
    deleteRectChildren(rects);
    let roots = createTreeFromRects(rects);
    roots.sort((rectA, rectB) => {
      return rectA.top - rectB.top;
    });
    const target = document.getElementById("preview-panel").contentDocument
      .body;
    target.innerHTML = "";
    createAndAppendChildElementsToDOM(target, roots);
  };
};
