/**
 * 3D Spatial Index for Vector Blocks
 *
 * Implements k-d tree for efficient nearest neighbor queries
 * in 3D legal code space.
 */

class KDNode {
  constructor(point, id, axis, left = null, right = null) {
    this.point = point;    // [x, y, z]
    this.id = id;          // block ID
    this.axis = axis;      // split axis (0=x, 1=y, 2=z)
    this.left = left;
    this.right = right;
  }
}

class SpatialIndex {
  constructor() {
    this.root = null;
    this.dimensions = 3;
  }

  // Build k-d tree from points
  build(points) {
    // points: [{ id, x, y, z }, ...]
    const data = points.map(p => ({
      point: [p.x, p.y, p.z],
      id: p.id,
    }));

    this.root = this.buildTree(data, 0);
    return this;
  }

  buildTree(points, depth) {
    if (points.length === 0) return null;

    const axis = depth % this.dimensions;

    // Sort by current axis
    points.sort((a, b) => a.point[axis] - b.point[axis]);

    const mid = Math.floor(points.length / 2);
    const node = new KDNode(
      points[mid].point,
      points[mid].id,
      axis,
      this.buildTree(points.slice(0, mid), depth + 1),
      this.buildTree(points.slice(mid + 1), depth + 1)
    );

    return node;
  }

  // Find k nearest neighbors
  kNearest(queryPoint, k = 5) {
    const results = [];
    this.searchNearest(this.root, queryPoint, k, results);
    return results.sort((a, b) => a.distance - b.distance);
  }

  searchNearest(node, queryPoint, k, results) {
    if (!node) return;

    const dist = this.euclideanDistance(queryPoint, node.point);

    // Add to results if closer than worst in heap
    if (results.length < k) {
      results.push({ id: node.id, point: node.point, distance: dist });
    } else if (dist < results[results.length - 1].distance) {
      results.pop();
      results.push({ id: node.id, point: node.point, distance: dist });
      results.sort((a, b) => a.distance - b.distance);
    }

    // Determine which subtree to search first
    const axis = node.axis;
    const diff = queryPoint[axis] - node.point[axis];
    const first = diff < 0 ? node.left : node.right;
    const second = diff < 0 ? node.right : node.left;

    // Search closer subtree
    this.searchNearest(first, queryPoint, k, results);

    // Check if we need to search other subtree
    const worstDist = results.length < k ? Infinity : results[results.length - 1].distance;
    if (Math.abs(diff) < worstDist) {
      this.searchNearest(second, queryPoint, k, results);
    }
  }

  // Range query - find all points within radius
  rangeQuery(center, radius) {
    const results = [];
    this.searchRange(this.root, center, radius, results);
    return results;
  }

  searchRange(node, center, radius, results) {
    if (!node) return;

    const dist = this.euclideanDistance(center, node.point);
    if (dist <= radius) {
      results.push({ id: node.id, point: node.point, distance: dist });
    }

    const axis = node.axis;
    const diff = center[axis] - node.point[axis];

    // Check if we need to search both subtrees
    if (diff - radius <= 0) {
      this.searchRange(node.left, center, radius, results);
    }
    if (diff + radius >= 0) {
      this.searchRange(node.right, center, radius, results);
    }
  }

  // Find all points in a bounding box
  boxQuery(minPoint, maxPoint) {
    const results = [];
    this.searchBox(this.root, minPoint, maxPoint, results);
    return results;
  }

  searchBox(node, minPoint, maxPoint, results) {
    if (!node) return;

    // Check if point is in box
    let inBox = true;
    for (let i = 0; i < this.dimensions; i++) {
      if (node.point[i] < minPoint[i] || node.point[i] > maxPoint[i]) {
        inBox = false;
        break;
      }
    }

    if (inBox) {
      results.push({ id: node.id, point: node.point });
    }

    // Check subtrees
    const axis = node.axis;
    if (minPoint[axis] <= node.point[axis]) {
      this.searchBox(node.left, minPoint, maxPoint, results);
    }
    if (maxPoint[axis] >= node.point[axis]) {
      this.searchBox(node.right, minPoint, maxPoint, results);
    }
  }

  euclideanDistance(p1, p2) {
    let sum = 0;
    for (let i = 0; i < this.dimensions; i++) {
      const diff = p1[i] - p2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  // Export tree for visualization
  export() {
    const nodes = [];
    const edges = [];

    const traverse = (node, parentIdx = null) => {
      if (!node) return;

      const idx = nodes.length;
      nodes.push({
        id: node.id,
        point: node.point,
        axis: node.axis,
      });

      if (parentIdx !== null) {
        edges.push({ from: parentIdx, to: idx });
      }

      traverse(node.left, idx);
      traverse(node.right, idx);
    };

    traverse(this.root);
    return { nodes, edges };
  }
}

module.exports = { SpatialIndex, KDNode };
