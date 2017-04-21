import Kan from '../../Kan.js';
import './panel.scss';

Kan.define("KanPanel",{
    alias: "kpanel",
    tag: "div",
    tpl: "{{children}}",
    cls: "k-panel"
});
