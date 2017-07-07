/* The purpose of this extension is to make it possible to toggle some of the menus
 * in the statusArea of the panel, such as Main.panel.statusArea.aggregateMenu. This
 * extension isn't super fancy and requires manual editing to add other menu toggles
 * if desired. You can use the Looking Glass functionality to find which menus are
 * available by typing Main.panel.statusArea. and pressing tab at the last dot which
 * should give you a list of properties/methods/objects. It's up to you to figure out
 * which ones are menus.
 *
 * Credit to:
 * Jonny Lamb and Pawel Bogut for adapting some of the code from the Hide Legacy Tray 
 * extension
 * Tudmotu for some code and ideas from the Clipboard Indicator extension
 */

const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Lang = imports.lang;

const Shell = imports.gi.Shell;

// Import the convenience.js (Used for loading settings schemas)
const Self = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Self.imports.convenience;

// Import config
const config = Self.imports.config;

function init() {
    this.settings = Convenience.getSettings();
    // Catch shortcut changes here. Add checks here for more shortcuts as you add them
    this.settings.connect('changed::' + config.aggregate_menu, Lang.bind(this, refreshBindings));
    this.settings.connect('changed::' + config.app_menu, Lang.bind(this, refreshBindings));
    
    this._shortcutsBindingIds = [];
}

function enable() {
    bindShortcuts();
}

function disable() {
    unbindShortcuts();
}

function toggleMenu(menuName) {
    // Add the if checks here and use the relevant menu here
    if (menuName == 'aggregate-menu') {
        menuToggle = Main.panel.statusArea.aggregateMenu;
    }
    if (menuName == 'app-menu') {
        menuToggle = Main.panel.statusArea.appMenu;
    }
    
    menuToggle.menu.toggle();
}

function bindShortcut(configName, funcName) {
    var ModeType = Shell.hasOwnProperty('ActionMode') ?
        Shell.ActionMode : Shell.KeyBindingMode;

    Main.wm.addKeybinding(
        configName,
        this.settings,
        Meta.KeyBindingFlags.NONE,
        ModeType.ALL,
        Lang.bind(this, funcName)
    );

    this._shortcutsBindingIds.push(configName);
}

function bindShortcuts() {
    unbindShortcuts();
    // Bind each shortcut here. User the function to be able to pass the config.js key to
    // use it with an if check (because I'm lazy and haven't though of a better way of 
    // doing this yet)
    bindShortcut(config.aggregate_menu, function(){
        toggleMenu(config.aggregate_menu);
    });
    bindShortcut(config.app_menu, function(){
        toggleMenu(config.app_menu);
    })
}

function unbindShortcuts() {
    this._shortcutsBindingIds.forEach(
        (id) => Main.wm.removeKeybinding(id)
    );

    this._shortcutsBindingIds = [];
}

function refreshBindings() {
    unbindShortcuts();
    bindShortcuts();
}
