export default class Food {
  constructor(confObj) {
    ['_id', 'name', 'kcal', 'proteins', 'carbs', 'fat']
      .forEach(prop => this[prop] = confObj[prop]);
    if (confObj.unit) {
      ['unit', 'unitWeight']
        .forEach(prop => this[prop] = confObj[prop]);
      this._units = 1;
      this.calcWeight();
    } else {
      this._weight = 0;
      this.calcNutrition();
    }
  }

  add(prop, delta, ease = false) {
    var deltaSign = delta >= 0 ? 1 : -1;
    if (ease) {
      let deltaAbs = Math.abs(delta);
      if (deltaAbs < 0.1) deltaAbs = 0.1;
      if (deltaAbs > 1) deltaAbs = 1;
      delta = deltaAbs * deltaSign;
    }
    this[prop] += delta;
    if (this[prop] < 0) this[prop] = 0;
    if (prop === '_weight') {
      this.calcUnits();
    } else {
      this.calcWeight();
    }
  }

  calcWeight() {
    this._weight = this.unitWeight * this._units;
    this.calcNutrition();
  }

  calcUnits() {
    this._units = this._weight / this.unitWeight;
    this.calcNutrition();
  }

  calcNutrition() {
    ['kcal', 'proteins', 'carbs', 'fat']
      .forEach(val => {
        this['_weight_' + val] = this[val] * this._weight / 100;
      });
  }

  calcKcal() {
    this.kcal = (this.proteins + this.carbs) * 4 + this.fat * 9;
  }
}