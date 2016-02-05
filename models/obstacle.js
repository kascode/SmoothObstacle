/**
 * Created by kascode on 05.02.16.
 */

"use strict";

module.exports = function (sequielize, DataTypes) {
  return sequelize.define("Obstacle", {
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    img: DataTypes.STRING
  });
};