import Kan from '../src/Kan.js';
import { BackboneBuilder } from '../src/builders/backboneBuilder.js'
import '../src/components/';
import Backbone from 'backbone';

Kan.setBuilder(BackboneBuilder);
const ButtonClass = Kan.getClass("KanButton");
let btn = new ButtonClass({
    model: new Backbone.Model({ children: "hola btn"})
});
document.body.appendChild(btn.render().$el[0]);
