/**
* Theme: Larkon - Responsive Bootstrap 5 Admin Dashboard
* Author: Techzaa
* Module/App: Theme Config Js
*/

class Config {

     //  Default Config Value (config value chaneg )
     constructor() {
          this.config = {
               theme: "light",             // Dark

               layout: "vertical",        // 'horizontal'

               direction: "ltr",          // rtl

               topbar: {
                    color: "light",       // dark
               },

               menu: {
                    size: "sm-hover-active",   // [ 'default', sm-hover-active', 'condensed', 'full'] === (This option for only vertical layout (left Sidebar) Menu)
                    color: "light",            // ['light', 'dark', 'brand']
               },
          };
          window.defaultConfig = this.config
     }

     setConfig() {
          let config = this.config;
          var savedConfig = localStorage.getItem("__Larkon_CONFIG__");
          // var savedConfig = sessionStorage.getItem("__Larkon_CONFIG__");

          let html = document.getElementsByTagName('html')[0];
          window.html = html;

          if (savedConfig !== null) {
               config = JSON.parse(savedConfig);
          }

          window.config = config;

          if (config) {
               html.setAttribute("data-theme", config.theme);
               html.setAttribute("data-layout", config.layout);
               html.setAttribute("data-topbar-color", config.topbar.color);
               html.setAttribute("data-menu-color", config.menu.color);
               if (config.layout == "vertical") {
                    html.setAttribute("data-menu-size", config.menu.size);
               }
          }

          if (window.innerWidth <= 1040) {
               html.setAttribute("data-layout", "vertical");
               html.setAttribute("data-menu-size", "full");
          }

          if (config.direction == "rtl") {
               document.getElementsByTagName('html')[0].dir = "rtl";
          }
     }

     init() {
          try {
               this.setConfig();
          } catch (e) {
               localStorage.setItem('__Larkon_CONFIG__', JSON.stringify(this.config));
               this.setConfig();
          }
     }
}

new Config().init();