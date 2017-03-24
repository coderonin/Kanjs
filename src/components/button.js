import Kan from '../Kan.js';

Kan.define("KanButton",{
    alias: "kbutton",
    tpl: "<button>{children}</button>",
    cls: "k-button",
    events: ['click'],
    listeners: {
        click: function(cmp, builder, event){
            console.log("internally components could do some logic before actually trigger an event");
            builder.addCls(cmp, "x-focus");
            builder.trigger("click", cmp, event);
        },
        blur: function(cmp, builder, event){
            builder.removeCls(cmp, "x-focus");
            builder.trigger("blur", cmp, event);
        }
    }
});