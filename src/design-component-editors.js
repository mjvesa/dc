import { vaadinButtonEditor } from "./dc/editor/vaadin-button-editor";
import { vaadinSplitLayoutEditor } from "./dc/editor/vaadin-split-layout-editor";
import { vaadinTabsEditor } from "./dc/editor/vaadin-tabs-editor";
import { vaadinGridEditor } from "./dc/editor/vaadin-grid-editor";
import { vaadinGridColumnEditor } from "./dc/editor/vaadin-grid-column-editor";
import { gridUpdaterAction } from "./dc/action/grid-updater-action";
import { rawGridUpdaterAction } from "./dc/action/raw-grid-updater-action";
import { defaultEditor } from "./dc/editor/default-editor";
import { scriptEditor } from "./dc/editor/script-editor";
import { simpleRestAction } from "./dc/action/simple-rest-action";
import { listRestAction } from "./dc/action/list-rest-action";
import { sizesEditor } from "./dc/editor/sizes-editor";
import { stateAction } from "./dc/action/state-action";
import { styleEditor } from "./dc/editor/style-editor";
import { flexboxEditor } from "./dc/editor/flexbox-editor";
import { gridNewItemEditor } from "./dc/action/grid-new-item-editor";

export const designComponentEditors = [
  ["script", gridUpdaterAction],
  ["script", rawGridUpdaterAction],
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
