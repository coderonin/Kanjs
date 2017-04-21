import Kan from '../Kan.js';
import Backbone from 'backbone';
import _ from 'underscore';

_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

/**
 * @module Kan.BackboneBuilder
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

                if (!(this.model instanceof Backbone.Model)) {
                    this.model = new Backbone.Model(this.model);
                }
                this.model.bind('change', this.syncRender, this);

                _.forEach(this.options.listeners || {}, (listenerHandler, name) => {
                    this.on(name, listenerHandler, this);
                });
                this.parseModel();
            },
            parseModel: function(){
                let items = this.model.get("items");
                if (items){
                    this.items = items;
                }
            },
            syncRender: function(){
                this.parseModel();
                this.render();
            },
            render: function() {
                let renderData = {
                    children: "<div class='target-transpile'><div>"
                };
                if (this.model) {
                     renderData = Object.assign(renderData, JSON.parse(JSON.stringify(this.model.toJSON())));
                }
                this.$el.html(_.template(this.template)(renderData));
                let target = this.$el.find(".target-transpile")[0];
                if (this.items && target) {
                    BackboneBuilder.renderTree(this, target);
                }
                if(target) {
                    target.remove();
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

    renderTree: (cmp, target) => {
        let classDefinition;
        let el;
        let items = [];
        let current = target;
        let parent = current.parentNode;

        _.forEach(cmp.items, (item) => {
            if (item.alias) {
                classDefinition = Kan.getClassByAlias(item.alias);
                item = new classDefinition(item);
            }
            el = item.render().el;
            parent.insertBefore(el, current.nextSibling);
            current = el;
            items.push(item);
        });
        cmp.items = items;
    }
};
