/**
 * @class Kan
 * @singleton
 *
 */
(function(globalContext){
    var Kan = {},
        _builder,
        _cmpCache = {},
        _cmpByAliasCache = {},

        /**
         * Permite definir un componente con la libreria.
         * @method define
         * @param String name El nombre del componente a definir
         * @param Object config Definición del componente.
         */
        defineComponent = function(name, config){
            if (_cmpCache[name]) {
                throw "ERROR: Class '" + className + "' already defined.";
            }

            if (config.alias && _cmpByAliasCache[config.alias]) {
                throw "ERROR: There is a Class already using alias '" + alias + ".";
            } else {
                _cmpByAliasCache[config.alias] = name;
            }

            _cmpCache[name] = config;
        },

        /**
         * Kan necesita un concrete Builder para crear las clases que define. Una aplicación que utilice Kan,
         * según su stack tecnológico, debería instanciar y settear un builder antes de comenzar a utilizar componentes definidos en Kan.
         * @method setBuilder
         * @param Object builder Instancia o clase estatica que cumpla con la firma definida para un builder de Kan.
         */
        setConcreteBuilder = function(builder){
            _builder = Object.assign(_builder, builder);
        },

        /**
         * Obtiene una clase definida con Kan inplementada en el stack tecnológico del concrete builder.
         * @method getClass
         * @param className
         */
        getClass = function(className) {
            if (!_cmpCache[className]) {
                throw "ERROR: Class '" + className + "' not defined.";
            } else if (_cmpCache[className].$kDefined) {
                return _cmpCache[className];
            }
            let cmp = _builder.build(_cmpCache[className]);
            cmp.$kDefined = true;
            _cmpCache[className] = cmp;
            return cmp;
        },

        /**
         * Obtiene una clase definida con Kan inplementada en el stack tecnológico del concrete builder.
         * @method getClass
         * @param className
         */
        getClassByAlias = function(alias){
            if (!_cmpByAliasCache[className]) {
                throw "ERROR: There isn't a Class with alias '" + alias + ".";
            }
            return getClass(_cmpByAliasCache[alias]);
        },

        /**
         * @private
         * Crea una clausura que lanza una excepcion cuando un método no esta definido.
         * @method notImplemented
         * @param String methodName Nombre del método no definido
         * @param String className Nombre de la clase del método no definido
         */
        notImplemented = function(methodName, className){
            return function(){
                throw "ERROR: Method " + methodName + ", from class " + className + " not implemented.";
            };
        };

    /**
     * @interface Kan.Builder
     * Interfaz que define las acciones que debe realizar un concrete builder.
     * Un builder es capaz de comprender la definición de una clase definida con Kan y retornar una clase en el stack de tecnología para el cual
     * el builder fue definido.
     */
    _builder = {
        /**
         *
         * @method build
         */
        build: notImplemented("build", "Kan.ConcreteBuilder"),
        addCls: notImplemented("addCls", "Kan.ConcreteBuilder"),
        removeCls: notImplemented("removeCls", "Kan.ConcreteBuilder"),
        trigger: notImplemented("trigger", "Kan.ConcreteBuilder")
    };

    Kan = Object.assign(Kan, {
        define: defineComponent,
        setBuilder: setConcreteBuilder,
        getClass: getClass,
        getClassByAlias: getClassByAlias
    });

    globalContext.Kan = Kan;
})(window || global);
