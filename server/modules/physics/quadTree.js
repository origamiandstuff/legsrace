const ngeohash = require('ngeohash');
console.log("QuadTree loaded!");
class GeoHashGrid {
    constructor(width, height, precision = 5) {
        this.width = width;
        this.height = height;
        this.precision = precision;
        this.grid = {};
        this.totalInstances = [];
    }

    getHash(lat, lon) {
        return ngeohash.encode(lat, lon, this.precision);
    }

    addToGrid(instance) {
        this.totalInstances.push(instance);

        const hash = this.getHash(instance.lat, instance.lon);

        if (!this.grid[hash]) {
            this.grid[hash] = [];
        }
        this.grid[hash].push(instance);
    }

    getNearbyInstances(instance) {
        const hash = this.getHash(instance.lat, instance.lon);
        const neighbors = new Set();

        const neighboringHashes = ngeohash.neighbors(hash);

        neighboringHashes.push(hash);

        neighboringHashes.forEach(h => {
            if (this.grid[h]) {
                this.grid[h].forEach(obj => neighbors.add(obj));
            }
        });

        return Array.from(neighbors);
    }

    reset(list) {
        this.grid = {}; 
        this.totalInstances = [];
        for (let i = 0; i < list.length; i++) {
            this.addToGrid(list[i]);
        }
    }

    hitDetection(instance, other) {
        return (
            Math.sqrt(Math.pow(other.lat - instance.lat, 2) + Math.pow(other.lon - instance.lon, 2)) < (instance.size + other.size)
        );
    }

    queryForCollisionPairs() {
        let pairs = [];
        const instances = this.totalInstances;

        for (let i = 0; i < instances.length; i++) {
            let instance = instances[i];
            let nearby = this.getNearbyInstances(instance);

            for (let j = 0; j < nearby.length; j++) {
                let other = nearby[j];
                let pair = instance.id > other.id ? [other.id, instance.id] : [instance.id, other.id];
                if (!pairs.includes(pair) && this.hitDetection(instance, other) && instance.id !== other.id) {
                    pairs.push(pair);
                }
            }
        }

        return pairs;
    }
}

class CollisionGrid {
    constructor(width, height, precision = 5) {
        this.geoHashGrid = new GeoHashGrid(width, height, precision);
    }

    addToGrid(instance) {
        this.geoHashGrid.addToGrid(instance);
    }

    getCell(instance) {
        return this.geoHashGrid.getNearbyInstances(instance);
    }

    reset(list) {
        this.geoHashGrid.reset(list);
    }

    hitDetection(instance, other) {
        return this.geoHashGrid.hitDetection(instance, other);
    }

    queryForCollisionPairs() {
        return this.geoHashGrid.queryForCollisionPairs();
    }
}

module.exports = { QuadTree: GeoHashGrid, CollisionGrid };