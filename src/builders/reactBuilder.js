import Kan from '../Kan.js';
import React from 'react';
import _ from 'underscore';

_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

/**
 * @class Kan.ReactBuilder
 * Concrete builder para una applicacion en Backbone
 */

export const ReactBuilder = {
    build: (cmpDefinition) => {

        const template = parseDOM(`<${cmpDefinition.tag}>` + cmpDefinition.tpl + `</${cmpDefinition.tag}>`);

        return React.createClass({
            getInitialState: function(){
                let definition = JSON.parse(JSON.stringify(cmpDefinition));
                let className = definition.cls;
                if (this.props.className) {
                    className = [className, " ", this.props.className].join();
                }
                Object.assign(definition, this.props);
                definition.className = className;
                return definition;
            },
            render: function() {
                return renderTree(template, this);
            }
        });

/*
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
        return Backbone.View.extend(definition);*/
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
    }
};

const renderTree = (definition, context) => {
    let tag = definition.type;
    let attrs = Object.assign({ className: context.state.cls }, definition.attributes);
    let content = definition.content;
    if (Array.isArray(content)) {
        content = content.map((item) => {
            if (typeof item === "string") {
                if (item === "{{children}}") {
                    let props = context.props;
                    let children = props["children"] || props["items"];
                    if (children){
                        return resolveChildren(children);
                    }
                }
                return item;
            }
            return renderTree(item);
        });
    }
    return React.createElement(tag, attrs, content);
};

const resolveChildren = (items) => {
    let classDefinition;
    return items.map( (item) => {
        if (item.alias) {
            classDefinition = Kan.getClassByAlias(item.alias);
            item = React.createElement(classDefinition, item);
        }
        return item;
    });
};

const parseDOM = (element) => {
    let treeObject = {};
    let parser, docNode;
    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
              parser = new DOMParser();
              docNode = parser.parseFromString(element,"text/xml");
        } else { // Microsoft strikes again
              docNode = new ActiveXObject("Microsoft.XMLDOM");
              docNode.async = false;
              docNode.loadXML(element);
        }
        element = docNode.firstChild;
    }

    treeHTML(element, treeObject);
    return treeObject;
};

//Recursively loop through DOM elements and assign properties to object
const treeHTML = (element, object) => {
    object["type"] = element.nodeName;
    var nodeList = element.childNodes;
    if (nodeList != null) {
        if (nodeList.length) {
            object["content"] = [];
            for (var i = 0; i < nodeList.length; i++) {
                if (nodeList[i].nodeType == 3) {
                    object["content"].push(nodeList[i].nodeValue);
                } else {
                    object["content"].push({});
                    treeHTML(nodeList[i], object["content"][object["content"].length -1]);
                }
            }
        }
    }
    if (element.attributes != null) {
        if (element.attributes.length) {
            object["attributes"] = {};
            for (var i = 0; i < element.attributes.length; i++) {
                object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
            }
        }
    }
}
