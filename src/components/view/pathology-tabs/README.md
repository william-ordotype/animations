layout: {
empty,
filled
}
iterator: {
noteList
}
show: {
isTabActive
}
event: {
tabCLick,
}

text: {
title,
author,
richText,
pathology
}

 <div data-w-tab="Notes" class="w-tab-pane" x-data="PathologyPaneList('notes')">
                <template x-bind="noteListIterator">
                    <div x-bind="noteElement">
                         <span x-bind="noteTitle">
                            title
                        </span>
                        <span x-bind="isNoteSharedIcon"> shared icon</span>
                        <template x-bind="fileIconIterator">
                                <span x-bind="fileIconElement">
                                icon
                            </span>
                        </template>

                    </div>
                </template>