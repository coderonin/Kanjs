import Kan from '../src/Kan.js';
import '../src/components/';
import './app.scss';
import { BackboneBuilder } from '../src/builders/backboneBuilder.js'
import Backbone from 'backbone';

Kan.setBuilder(BackboneBuilder);
const PanelClass = Kan.getClass("KanPanel");

let panel = new PanelClass({
    model: {
        items: [
            {
                alias: "kbutton",
                model: new Backbone.Model({ children: "hola btn"})
            },
            {
                alias: "kbutton",
                model: {
                    times: 0,
                    children: "hola btn2"
                },
                listeners: {
                    click: function() {
                        let times = this.model.get("times");
                        times++;
                        this.model.set("times", times);
                        this.model.set("children", "clicked " + this.model.get("times") + " times");
                    }
                }
            }
        ]
    }
});

document.body.appendChild(panel.render().$el[0]);
