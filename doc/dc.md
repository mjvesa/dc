# Designer Components

This is the technical reference to DC.

## Architecture

DC consists of two parts: Editor Core and Designer Components.
Editor Core handles the manipulation of rectangles, synthesis of
a tree from nested rectangles and compiling the tree to a static
DOM that is exportable as is and can also be directly used to preview
the design.

## Editor Core

The EC manages a flat list of rectangles. Each rectangle has the following
properties:

- tag
- top,right,bottom and left coordinates.
- editor
- style
- props
- attributes
- children

The children property is created by EC when forming a tree from the
rectangles by using their their positions relative to each other.

The style property contains the styles of the element represented by this
rect. The should be gathered into a single place and attached to the element
by a CSS selector that uniquely identifies it. An implementation can also
choose to attach it directly to the styles attribute of the element.

## Designer Components

DCs are independent building blocks represented by an object with
the following properties:

- name
- fn

Name gives the name to the editor that is shown by the EC. The fn property
contains a procedure (function without return value):

`(DCAPI, rect) => {}`

The rect parameter is the rectangle where the editor is to draw its user
interace. DCAPI is a structure that can be used to access the EC. It's properties are:

- refresh
- rects

Refresh is a procedure that causes the preview of the model to be redrawn. The
rects property contains an array that contains the entire model which consists
of the rects discussed above.
