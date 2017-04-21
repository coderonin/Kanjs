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
        const classDefinition = {
            getInitialState: function(){
                this.tpl = JSON.parse(JSON.stringify(template));
                let definition = JSON.parse(JSON.stringify(cmpDefinition));
                let className = new Set();
                className.add(definition.cls);
                if (this.props.className) {
                    className.add(this.props.className);
                }
                Object.assign(definition, this.props);
                definition.className = className;
                return definition;
            },
            render: function() {
                const me = this;
                if (!me.tpl.attributes) {
                    me.tpl.attributes = {};
                    for (name of Object.keys(cmpDefinition.events || {})){
                        me.tpl.attributes["on"+(name.replace(/\b\w/g, l => l.toUpperCase()))] =  me.eventHandlerBuilder(name);
                    }
                }
                return renderTree(me.tpl, this);
            },
            eventHandlerBuilder: function(eventName){
                const me = this;
                return function(e) {
                    cmpDefinition.events[eventName](me, ReactBuilder, e);
                }
            }
        };

        return React.createClass(classDefinition);
    },
    /**
     *
     * @method addCls
     */
    addCls: (cmp, cls) => {
        let { className } = cmp.state;
        if(!className.has(cls)){
            className.add(cls);
            cmp.setState({className});
        }
    },
    /**
     *
     * @method removeCls
     */
    removeCls: (cmp, cls) => {
        let { className } = cmp.state;
        if(className.has(cls)){
            className.delete(cls);
            cmp.setState({className});
        }
    },
    /**
     *
     * @method trigger
     */
    trigger: (eventName, cmp, event) => {
        if(cmp.props[eventName]){
            cmp.props[eventName].apply(cmp, event);
        }
    }
};

const renderTree = (definition, context) => {
    let tag = definition.type;
    let attrs = Object.assign({ className: [...context.state.className].join(" ") }, definition.attributes);
    let content = definition.content;
    if (Array.isArray(content)) {
        content = content.map((item) => {
            if (typeof item === "string") {
                if (item === "{{children}}") {
                    let props = context.props;
                    let children = props["children"] || props["items"];
                    if (children){
                        return Array.isArray(children) ? resolveChildren(children) : children;
                    }
                }
                return item;
            }
            return renderTree(item, context);
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
