// configuration for both development and production...
abstract class Config {
    public readonly registerURL: string;
    public readonly loginURL: string;
    public readonly getUserById: string;
    public readonly vacationsURL: string;
    public readonly vacationImagesURL: string;
    public readonly followersURL: string;
    public readonly getAllFollowedVacationsByUserId: string;
    public readonly getAllFollowersForVacation: string;
    public readonly getAllFollowedVacations: string;
  
    public constructor(baseURL: string) {
      this.registerURL = baseURL + "auth/register/";
      this.loginURL = baseURL + "auth/login/";
      this.getUserById = baseURL + "auth/get-user/";
      this.vacationsURL = baseURL + "vacations/";
      this.vacationImagesURL = this.vacationsURL + "images/";
      this.followersURL = baseURL + "followers/";
      this.getAllFollowedVacationsByUserId = this.followersURL + "by-user-id/";
      this.getAllFollowersForVacation = this.followersURL + "by-vacation-id/";
      this.getAllFollowedVacations = this.followersURL + "all-followed-vacations/";
    }
  }
  
  class DevelopmentConfig extends Config {
    public constructor() {
      super("http://localhost:3001/api/");
    }
  }
  
  class ProductionConfig extends Config {
    public constructor() {
      super("http://localhost:3001/api/");
    }
  }
  
  const config =
    process.env.NODE_ENV === "development"
      ? new DevelopmentConfig()
      : new ProductionConfig();
  
  export default config;
  