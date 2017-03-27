import Kan from '../src/Kan.js';
import { BackboneBuilder } from '../src/builders/backboneBuilder.js'
import '../src/components/';
import Backbone from 'backbone';
import _ from 'underscore';

Kan.setBuilder(BackboneBuilder);
const ButtonClass = Kan.getClass("KanButton");
let btn = new ButtonClass({
    model: new Backbone.Model({ children: "hola btn"})
});
let btn2 = new ButtonClass({
    model: new Backbone.Model({
        times: 0,
        children: "hola btn2"
    })
});

const addClicks = function() {
    let times = this.model.get("times");
    times++;
    this.model.set("times", times);
    this.model.set("children", "clicked " + this.model.get("times") + " times");
}

btn2.on("click", _.bind(addClicks, btn2));

document.body.appendChild(btn.render().$el[0]);
document.body.appendChild(btn2.render().$el[0]);
