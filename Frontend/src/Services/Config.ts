// configuration for both development and production...
abstract class Config {

    public isDevelopment = (process.env.NODE_ENV === "development");

    public readonly authUrl: string;
    public readonly vacationsUrl: string;
    public readonly vacationImagesUrl: string;
    public readonly followersUrl: string;

    public constructor(baseUrl: string) {
        this.authUrl = baseUrl + "auth/";
        this.vacationsUrl = baseUrl + "vacations/";
        this.vacationImagesUrl = baseUrl + "vacations/images/";
        this.followersUrl = baseUrl + "followers/"
    }
}

// configuration for development environment...
class DevelopmentConfig extends Config {
    public constructor() {
        super("http://localhost:3001/api/");
    }
}

// configuration for production environment...
class ProductionConfig extends Config {
    public constructor() {
        super("http://www.mysite.com/api/");
    }
}

const config = process.env.NODE_ENV === "development" ? new DevelopmentConfig() : new ProductionConfig();

export default config;