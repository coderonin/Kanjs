import * as Backbone from 'backbone';

/**
 * @class Kan.BackboneBuilder
 * Concrete builder para una applicacion en Backbone
 */

export const BackboneBuilder = {
    build: (cmpDefinition) => {
        return Backbone.View.extend({
            className: cmpDefinition.cls,
            tpl: cmpDefinition.tpl
        });
    },
    /**
     *
     * @method addCls
     */
    addCls: () => {

    },
    /**
     *
     * @method removeCls
     */
    removeCls: () => {

    },
    /**
     *
     * @method trigger
     */
    trigger: () => {

    }
};
