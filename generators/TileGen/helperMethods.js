function findHexagonCenters(points) {
    let midpoint = {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2
    };
    let dx = points[1].x - points[0].x;
    let dy = points[1].y - points[0].y;
    let sideLength = Math.sqrt(dx * dx + dy * dy);
    
    let apothem = sideLength * Math.sqrt(3) / 2;
    slope = Math.atan2(dx, dy);
    
    let results = [{
        x: midpoint.x + apothem * Math.cos(slope),
        y: midpoint.y - apothem * Math.sin(slope)
    }];

    let nextCenterDistance = apothem * 2;

    results[1] = {
        x: results[0].x,
        y: results[0].y - nextCenterDistance
    };

    results[2] = {
        x: results[0].x - sideLength * Math.sin(slope) - sideLength,
        y: results[0].y - apothem
    }

    results[3] = {
        x: results[2].x,
        y: results[2].y - nextCenterDistance
    }

    return results
  }


  module.exports.findHexagonCenters = findHexagonCenters;