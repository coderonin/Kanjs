import Kan from '../src/Kan.js';
import { BackboneBuilder } from '../src/builders/backboneBuilder.js'
import '../src/components/button.js';

Kan.setBuilder(BackboneBuilder);
const button = new Kan.getClass("KanButton")();
console.log(button.render().$el);
