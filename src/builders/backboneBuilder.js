import Backbone from 'backbone';
import _ from 'underscore';

_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

/**
 * @class Kan.BackboneBuilder
 * Concrete builder para una applicacion en Backbone
 */

export const BackboneBuilder = {
    build: (cmpDefinition) => {
        var definition = {
            tagName: cmpDefinition.tag,
            className: cmpDefinition.cls,
            template: cmpDefinition.tpl,
            events: {},
            render: function() {
                this.$el.html(_.template(this.template)(this.model.attributes));
                return this;
            },
            eventHandlerBuilder: (eventName) => function(e) {
                cmpDefinition.listeners[eventName](this, BackboneBuilder, e);
            }
        };

        _.forEach(cmpDefinition.listeners, (listener, name) => {
            definition.events[name] = definition.eventHandlerBuilder(name);
        });
        return Backbone.View.extend(definition);
    },
    /**
     *
     * @method addCls
     */
    addCls: (cmp, cls) => {
        cmp.$el.addClass(cls);
    },
    /**
     *
     * @method removeCls
     */
    removeCls: (cmp, cls) => {
        cmp.$el.removeClass(cls);
    },
    /**
     *
     * @method trigger
     */
    trigger: () => {

    }
};
