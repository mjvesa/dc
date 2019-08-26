import { vaadinButtonEditor } from "./vaadin-button-editor";
import { vaadinSplitLayoutEditor } from "./vaadin-split-layout-editor";
import { vaadinTabsEditor } from "./vaadin-tabs-editor";
import { defaultEditor } from "./default-editor";
import { scriptEditor } from "./script-editor";
import { styleEditor } from "./style-editor";
import { flexboxEditor } from "./flexbox-editor";
import { gridNewItemEditor } from "./grid-new-item-editor";
import { vaadinGridEditor } from "./vaadin-grid-editor";
import { vaadinGridColumnEditor } from "./vaadin-grid-column-editor";

export const designComponentEditors = [
  ["script", gridNewItemEditor],
  ["script", scriptEditor],
  ["*", defaultEditor],
  ["*", flexboxEditor],
  ["*", styleEditor],
  ["vaadin-grid", vaadinGridEditor],
  ["vaadin-grid-column", vaadinGridColumnEditor],
  ["vaadin-button", vaadinButtonEditor],
  ["vaadin-split-layout", vaadinSplitLayoutEditor],
  ["vaadin-tabs", vaadinTabsEditor]
];
