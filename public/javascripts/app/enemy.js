/**
 * Created by d on 28.07.2014.
 */

define(['three', 'threeder/threeder', 'pathfinding/lib/pathfinding-browser'], function(THREE, Threeder, Pathfinding) {

    var Enemy = (function() {
        function Enemy (param) {
            Threeder.Entity.constructor.call(this, param);
            this.type = 'Enemy';
        }

        Enemy.prototype.attack = function() {

        };

        return Enemy;
    })();
});