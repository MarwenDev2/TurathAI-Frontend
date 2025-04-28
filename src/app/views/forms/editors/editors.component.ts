import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { QuillEditorComponent } from 'ngx-quill';
import type Editor from 'quill/core/editor';

@Component({
  selector: 'app-editors',
  standalone: true,
  imports: [UIExamplesListComponent,QuillEditorComponent,FormsModule],
  templateUrl: './editors.component.html',
  styles: ``
})
export class EditorsComponent {
title="Editors"

editor!: Editor

content: string = ` <div id="snow-editor" style="height: 300px">
<h3>
    <span class="ql-size-large">Hello World!</span>
</h3>
<p><br /></p>
<h3>
    This is a simple editable area.
</h3>
<p><br /></p>
<ul>
    <li>
        Select a text to reveal the
        toolbar.
    </li>
    <li>
        Edit rich document
        on-the-fly, so elastic!
    </li>
</ul>
<p><br /></p>
<p>End of simple area</p>
</div>`
content1: string = `<div id="bubble-editor" style="height: 300px">
<h3>
    <span class="ql-size-large">Hello World!</span>
</h3>
<p><br /></p>
<h3>
    This is a simple editable area.
</h3>
<p><br /></p>
<ul>
    <li>
        Select a text to reveal the
        toolbar.
    </li>
    <li>
        Edit rich document
        on-the-fly, so elastic!
    </li>
</ul>
<p><br /></p>
<p>End of simple area</p>
</div>`

public model = {
  editorData: this.content,
}

editorConfig = {
  toolbar: [
    [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ align: [] }],

    ['link', 'image', 'video'],
    ['clean'],
  ],
}

editorConfigBubble = {
  toolbar: [
    ['bold', 'italic', 'link', 'blockquote'],
    [{ header: 1 }, { header: 2 }],
  ],
}
}
