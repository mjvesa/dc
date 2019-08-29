import { vaadinButtonEditor } from "./vaadin-button-editor";
import { vaadinSplitLayoutEditor } from "./vaadin-split-layout-editor";
import { vaadinTabsEditor } from "./vaadin-tabs-editor";
import { vaadinGridEditor } from "./vaadin-grid-editor";
import { vaadinGridColumnEditor } from "./vaadin-grid-column-editor";
import { gridUpdaterAction } from "./grid-updater-action";
import { defaultEditor } from "./default-editor";
import { scriptEditor } from "./script-editor";
import { simpleRestAction } from "./simple-rest-action";
import { listRestAction } from "./list-rest-action";
import { sizesEditor } from "./sizes-editor";
import { stateAction } from "./state-action";
import { styleEditor } from "./style-editor";
import { flexboxEditor } from "./flexbox-editor";
import { gridNewItemEditor } from "./grid-new-item-editor";

export const designComponentEditors = [
  ["script", gridUpdaterAction],
  ["script", gridNewItemEditor],
  ["script", scriptEditor],
  ["script", stateAction],
  ["script", simpleRestAction],
  ["script", listRestAction],
  ["*", defaultEditor],
  ["*", flexboxEditor],
  ["*", styleEditor],
  ["*", sizesEditor],
  ["vaadin-grid", vaadinGridEditor],
  ["vaadin-grid-column", vaadinGridColumnEditor],
  ["vaadin-button", vaadinButtonEditor],
  ["vaadin-split-layout", vaadinSplitLayoutEditor],
  ["vaadin-tabs", vaadinTabsEditor]
];
