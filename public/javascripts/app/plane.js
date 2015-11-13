define(['three'], function(THREE) {
    return function(width, height, tWidth, tHeight) {
        width = width || 10;
        height = height || 10;
        tWidth = tWidth || 1;
        tHeight = tHeight || 1;
        var tiles = [];
        for (var h = 0; h < height; h += 1) {
            for (var w = 0; w < width; w += 1) {
                if (w === 0) {
                    tiles[h] = [];
                }
                var geometry = new THREE.PlaneGeometry(tWidth - 0.01, tHeight - 0.01);
                var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
                //var material = new THREE.MeshPhongMaterial({color: 0xffff00 + ((20 * w) % 0xff)});
                tiles[h].push({
                    geometry: geometry,
                    material: material
                });
            }
        }
        return tiles;
    }
});