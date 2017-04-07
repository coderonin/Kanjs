import Kan from '../src/Kan.js';
import '../src/components/';
import './app.scss';
import { ReactBuilder } from '../src/builders/reactBuilder.js'
import React from 'react';
import ReactDOM from 'react-dom'

Kan.setBuilder(ReactBuilder);
const PanelClass = Kan.getClass("KanPanel");

var panel = React.createElement(PanelClass, {
    items: [
        {
            alias: "kbutton",
        },
        {
            alias: "kbutton",
            listeners: {
                click: function() {
                    /*let times = this.model.get("times");
                    times++;
                    this.model.set("times", times);
                    this.model.set("children", "clicked " + this.model.get("times") + " times");*/
                }
            }
        }
    ]
});
ReactDOM.render(panel, document.getElementById("application"));
