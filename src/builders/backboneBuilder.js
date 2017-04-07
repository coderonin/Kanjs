import Kan from '../Kan.js';
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
            initialize: function(options) {
                this.options = options;
                if (this.model) {
                    this.model.bind('change', this.render, this);
                }
                _.forEach(this.options.listeners || {}, (listenerHandler, name) => {
                    this.on(name, listenerHandler, this);
                });
            },
            render: function() {
                let renderData = {
                    children: "<div class='target-transpile'><div>"
                };
                if (this.model) {
                     renderData = Object.assign(renderData, JSON.parse(JSON.stringify(this.model.toJSON())));
                }
                this.$el.html(_.template(this.template)(renderData));
                if (this.options.items) {
                    BackboneBuilder.renderTree(this);
                }
                return this;
            },
            eventHandlerBuilder: (eventName) => function(e) {
                cmpDefinition.events[eventName](this, BackboneBuilder, e);
            }
        };

        _.forEach(cmpDefinition.events, (eventHandler, name) => {
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
    trigger: (eventName, cmp, event) => {
        cmp.trigger(eventName, event);
    },

    renderTree: (cmp) => {
        let classDefinition;
        let el;
        let items = [];
        let target = cmp.$el.find(".target-transpile")[0];
        let current = target;
        let parent = current.parentNode;

        _.forEach(cmp.options.items, (item) => {
            if (item.alias) {
                classDefinition = Kan.getClassByAlias(item.alias);
                item = new classDefinition(item);
            }
            el = item.render().el;
            parent.insertBefore(el, current.nextSibling);
            current = el;
            items.push(item);
        });
        target.remove();
        cmp.options.items = items;
    }
};
