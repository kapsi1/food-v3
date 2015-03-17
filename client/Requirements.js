export default class Requirements {
  constructor(weight = 0, bodyFat = 0) {
    this.weight = weight;
    this.bodyFat = bodyFat;
    this.update();
  }

  static kcalForLBM() {
    if (this.bodyFat >= 22.1) return 13;
    if (this.bodyFat >= 19.1) return 14;
    if (this.bodyFat >= 15.1) return 15;
    if (this.bodyFat >= 12.1) return 16;
    return 17;
  }

  update() {
    const kgToLbs = 2.20462262;
    var LBMkg = this.weight - this.weight * this.bodyFat / 100;
    var LBMlbs = LBMkg * kgToLbs;
    var baseKcal = LBMlbs * Requirements.kcalForLBM();

    var workoutKcal = baseKcal - 200;
    var workoutProtein = LBMlbs;
    var workoutCarbs = 0.75 * LBMlbs;
    var workoutFat = (workoutKcal - 4 * (workoutProtein + workoutCarbs)) / 9;
    this.workout = {
      kcal: workoutKcal,
      proteins: workoutProtein,
      carbs: workoutCarbs,
      fat: workoutFat
    };

    var restKcal = baseKcal - 600;
    var restProtein = 0.8 * LBMlbs;
    var restCarbs = 0.3 * LBMlbs;
    var restFat = (restKcal - 4 * (restProtein + restCarbs)) / 9;
    this.rest = {
      kcal: restKcal,
      proteins: restProtein,
      carbs: restCarbs,
      fat: restFat
    };
  }
}