# Designer Components

DC is an experimental designer where the architecture is split in two:
the Core Editor takes care of manipulating rectangles that are
used to draw trees by nesting them and placing them in various
arrangements. The Designer Components handle the contents of those
rectangles.

Each rectangle has a tag and represents some DOM element. That elemen
can be modified by any compatible editor that is placed in the rectangle.
The user is able to choose any applicable editor, and also extend the
editor with new Designer Components.

Anyone is welcomed to take part in improving the Core Editor and to submit
new Designer Components.

Read the documentation about the DC API and look at the existing Components
for guidance.
