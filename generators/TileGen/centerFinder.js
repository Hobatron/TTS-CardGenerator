function findHexagonCenter(points, centerIsHigher) {
    let midpoint = {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2
    };
    let dx = points[1].x - points[0].x;
    let dy = points[1].y - points[0].y;
    let sideLength = Math.sqrt(dx * dx + dy * dy);
    
    let distanceToCenter = sideLength * Math.sqrt(3) / 2;
    slope = Math.atan2(dx, dy);

    let result = {}; 
    if (slope > 0 || slope == 0) {
        if(centerIsHigher) {
            result = {
                x: midpoint.x + distanceToCenter * Math.cos(slope),
                y: midpoint.y - distanceToCenter * Math.sin(slope)
            }
        }  else {
            result =  {
                x: midpoint.x - distanceToCenter * Math.cos(slope),
                y: midpoint.y + distanceToCenter * Math.sin(slope)
            }
        }
    } else {
        if(centerIsHigher) {
            result =  {
                x: midpoint.x - distanceToCenter * Math.cos(slope),
                y: midpoint.y + distanceToCenter * Math.sin(slope)
            }
        }  else {
            result =  {
                x: midpoint.x + distanceToCenter * Math.cos(slope),
                y: midpoint.y - distanceToCenter * Math.sin(slope)
            }
        }
    }

    return {
        x: Math.round(result.x * 10) / 10,
        y: Math.round(result.y * 10) / 10
    }
  }
  module.exports.findHexagonCenter = findHexagonCenter;