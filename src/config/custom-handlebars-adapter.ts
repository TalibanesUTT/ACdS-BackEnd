import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as handlebars from 'handlebars';

export class CustomHandlebarsAdapter extends HandlebarsAdapter {
    constructor() {
        super();
        this.registerHelpers();
    }

    private registerHelpers() {
        handlebars.registerHelper('switch', function(value, options) {
            this.switch_value = value;
            return options.fn(this);
        });
    
        handlebars.registerHelper('case', function(value, options) {
            if (value == this.switch_value) {
                return options.fn(this);
            }
        });
    
        handlebars.registerHelper('default', function(options) {
            if (typeof this.switch_value === 'undefined') {
                return options.fn(this);
            }
        });
    }
}