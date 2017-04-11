function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function guid() {

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function enableDragDrop() {
    $("#draggable, .draggable, .draggablec, .dragrow").draggable({
        revert: true
    });

    // $(".dropcanvas").droppable({});

    $("#droppable, .droppable").droppable({
        classes: {
            "ui-droppable-hover": "dropactive"
        },
        // the activeClass option specifies the class to add to
        // the droppable when it is a possible candidate for
        // a draggable element
        //activeClass: "active",

        // here we specify the function to be run when the drop event
        // is triggered.
        drop: function(event, ui) {
            // blink($(this));

            if ($(ui.draggable).hasClass("dragpanel")) {
                //move
                $(this).append($(ui.draggable));
            } else {
                pls = $(ui.draggable).find("#placeholder");
                if (pls.length > 0) { // clone
                    placeholder = $(pls[0]).clone();
                } else { // move
                    placeholder = $(ui.draggable);
                }

                placeholder.css({ "display": '' });
                // $(this).html(ui.draggable.text());

                uid = (s4() + s4());

                pnl = $('<div id="' + uid + '" class="panel panel-info dragpanel ' + uid + '"> <div class="panel-heading"><button type="button" class="close" data-target="#' + uid + '" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></div><div class="panel-body"></div></div>');

                pnl.find(".panel-body").append(placeholder);

                $(this).append(pnl);

                $(pnl).draggable({ revert: true });
            }


        }
    });
}

$(document).ready(function() {



    enableDragDrop();

});

/* -- Vue --*/
var rowidx = 0;
var app = new Vue({
    el: '#canvas',
    data: {
        rows: [{
            idx: rowidx,
            cols: [{ klass: 'col-md-4 droppable' },
                { klass: 'col-md-4 droppable' },
                { klass: 'col-md-4 droppable' }
            ]
        }, {
            idx: ++rowidx,
            cols: [{ klass: 'col-md-4 droppable' },
                { klass: 'col-md-4 droppable' },
                { klass: 'col-md-4 droppable' }
            ]
        }]
    },
    computed: {
        collist: function(row) {
            var coltxt = "";
            for (var index = 0; index < row.cols.length; index++) {
                coltxt = coltxt + "," + row.cols[index].klass;

            }
            return coltxt;
        }
    },
    methods: {
        addRow: function(ix) {
            rowidx++;
            var row = {
                idx: rowidx,
                cols: [{ klass: 'col-md-4 droppable' },
                    { klass: 'col-md-4 droppable' },
                    { klass: 'col-md-4 droppable' }
                ]
            };

            if (ix === 0) {
                this.rows.unshift(row);
            } else {
                this.rows.push(row);
            }
            setTimeout(enableDragDrop, 1000);

        }
    }
});